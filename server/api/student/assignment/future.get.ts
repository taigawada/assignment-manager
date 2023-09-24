import { loadUser } from "@/server/middleware/authenticate";
import prisma from "@/server/prisma";
import SimpleDate from "~/utils/SimpleDate";

export default eventHandler(async (event) => {
  const { uid } = await loadUser(event);
  try {
    const assignments = await prisma.assignments.findMany({
      where: {
        OR: [
          {
            status: "active",
            teacherUid: uid,
            deadline: SimpleDate.future(),
            isDeleted: false,
          },
          {
            status: "active",
            teacherUid: uid,
            isRepeat: true,
            isDeleted: false,
          },
        ],
      },
      include: {
        assignedClasses: true,
        Teachers: true,
      },
    });
    if (!assignments) {
      return {
        status: "error",
        assignments: [],
      };
    }
    return {
      status: "success",
      assignments,
    };
  } catch (e) {
    return { status: "error", assignments: [] };
  }
});
