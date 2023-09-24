import { loadUser } from "@/server/middleware/authenticate";
import prisma from "@/server/prisma";
import SimpleDate from "~/utils/SimpleDate";
import { CyclePeriod } from "~/types/assignments";
import { getWeek } from "date-fns";
import { getSettingsAndRooms } from "../rooms.get";

export default eventHandler(async (event) => {
  const { uid } = await loadUser(event);
  try {
    const [assignments, settingsAndRooms] = await Promise.all([
      prisma.assignments.findMany({
        where: {
          OR: [
            {
              status: "active",
              teacherUid: uid,
              deadline: SimpleDate.today(),
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
        },
      }),
      getSettingsAndRooms(uid),
    ]);
    if (!assignments || !settingsAndRooms) {
      return {
        status: "error",
        assignments: [],
        settings: null,
        rooms: null,
      };
    }
    const nowDay = SimpleDate.now().getDay();
    const assignmentsFiltered = assignments.filter((data) => {
      if (Array.isArray(data.cyclePeriod) && data.isRepeat) {
        return data.cyclePeriod.some(
          // @ts-ignore
          (cycle) => cycle?.dayOfWeekIndex === nowDay,
        );
      }
      return true;
    });
    return {
      status: "success",
      assignments: assignmentsFiltered,
      settings: { submittionMethods: settingsAndRooms.submittionMethods },
      rooms: settingsAndRooms.rooms,
    };
  } catch (e) {
    return { status: "error", assignments: [], settings: null, rooms: null };
  }
});
