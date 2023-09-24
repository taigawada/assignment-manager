import { loadUser } from "@/server/middleware/authenticate";
import prisma from "@/server/prisma";

export default eventHandler(async (event) => {
  const { uid } = await loadUser(event);
  const rawId = event.context.params?.id || "";
  const assignmentSerial = parseInt(rawId, 10);
  if (!assignmentSerial) {
    return { status: "error", assignment: null };
  }
  try {
    const assignment = await prisma.assignments.findUnique({
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
    });
    return {
      status: "success",
      assignment,
    };
  } catch (e) {
    return { status: "error", assignment: null };
  }
});
