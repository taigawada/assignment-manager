import { loadUser } from "@/server/middleware/authenticate";
import prisma from "@/server/prisma";
import { getSettingsAndRooms } from "../rooms.get";

export default eventHandler(async (event) => {
  const { uid } = await loadUser(event);
  const rawId = event.context.params?.id || "";
  const assignmentSerial = parseInt(rawId, 10);
  if (!assignmentSerial) {
    return { status: "error", assignment: null, settings: null, rooms: null };
  }
  try {
    const [assignment, settingsAndRooms] = await Promise.all([
      prisma.assignments.findUnique({
        where: {
          serial_teacherUid: {
            serial: assignmentSerial,
            teacherUid: uid,
          },
          isDeleted: false,
        },
        include: {
          assignedClasses: true,
        },
      }),
      getSettingsAndRooms(uid),
    ]);
    if (!settingsAndRooms) {
      return { status: "error", assignment: null, settings: null, rooms: null };
    }
    return {
      status: "success",
      assignment,
      settings: { submittionMethods: settingsAndRooms.submittionMethods },
      rooms: settingsAndRooms.rooms,
    };
  } catch (e) {
    return { status: "error", assignment: null, settings: null, rooms: null };
  }
});
