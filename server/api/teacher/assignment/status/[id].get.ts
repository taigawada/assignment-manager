import { loadUser } from "@/server/middleware/authenticate";
import prisma from "@/server/prisma";
import _ from "lodash";

const isInvalidNumber = (index: unknown): index is number => {
  if (typeof index !== "number") return false;
  if (index < 0) return false;
  return true;
};

export default eventHandler(async (event) => {
  const { uid } = await loadUser(event);
  const rawId = event.context.params?.id || "";
  const assignmentSerial = parseInt(rawId, 10);
  const { index } = getQuery(event);
  const errorReturnValue = {
    status: "error",
    assignment: null,
    room: null,
    summary: null,
  };
  if (!_.isString(index)) {
    return errorReturnValue;
  }
  const indexNumber = parseInt(index, 10);
  if (!isInvalidNumber(indexNumber)) {
    return errorReturnValue;
  }
  if (!assignmentSerial) {
    return errorReturnValue;
  }
  try {
    const result = await prisma.$transaction(async (tx) => {
      const assignment = await tx.assignments.findUnique({
        where: {
          serial_teacherUid: {
            serial: assignmentSerial,
            teacherUid: uid,
          },
          isDeleted: false,
        },
        include: {
          assignedClasses: {
            orderBy: {
              name: "asc",
            },
          },
        },
      });
      if (!assignment) return errorReturnValue;
      const roomId = assignment.assignedClasses[indexNumber].id;
      const roomIds = assignment.assignedClasses.map((classElm) => classElm.id);
      const [
        room,
        studentsCount,
        allStudentCount,
        notSubmittedCount,
        allNotSubmittedCount,
      ] = await Promise.all([
        tx.rooms.findMany({
          where: {
            id: roomId,
          },
          include: {
            students: {
              select: {
                id: true,
                name: true,
                syussekiNo: true,
                Submittions: {
                  where: {
                    assignmentId: assignment.id,
                  },
                },
                room: true,
              },
            },
          },
        }),
        tx.students.count({
          where: {
            roomId,
          },
        }),
        tx.students.count({
          where: {
            roomId: {
              in: roomIds,
            },
          },
        }),
        tx.students.count({
          where: {
            roomId,
            Submittions: {
              every: {
                assignmentId: assignment.id,
                submittedAt: null,
              },
            },
          },
        }),
        tx.students.count({
          where: {
            roomId: {
              in: roomIds,
            },
            Submittions: {
              every: {
                assignmentId: assignment.id,
                submittedAt: null,
              },
            },
          },
        }),
      ]);
      const submittedCount = studentsCount - notSubmittedCount;
      const submittedAllCount = allStudentCount - allNotSubmittedCount;
      return {
        status: "success",
        assignment,
        room,
        summary: {
          notSubmitted: notSubmittedCount,
          percentageNotSubmitted:
            submittedCount !== 0 ? (submittedCount / studentsCount) * 100 : 0,
          allPercentageNotSubmitted:
            submittedAllCount !== 0
              ? (submittedAllCount / allStudentCount) * 100
              : 0,
          CumulativeAllPercentageNotSubmitted: 72,
          CumulativeAllPercentageNotSubmittedDelta: -5,
        },
      };
    });
    return result;
  } catch (e) {
    return errorReturnValue;
  }
});
