import { loadUser } from "@/server/middleware/authenticate";
import prisma from "@/server/prisma";

export const getSettingsAndRooms = async (uid: string) => {
  return prisma.teachers.findUnique({
    select: {
      submittionMethods: {
        select: {
          method: true,
        },
        orderBy: {
          index: "asc",
        },
      },
      rooms: true,
    },
    where: { uid },
  });
};

export default eventHandler(async (event) => {
  const { uid } = await loadUser(event);
  try {
    const result = await getSettingsAndRooms(uid);
    if (!result) {
      return { status: "error", settings: null, rooms: null };
    }
    return {
      status: "success",
      settings: { submittionMethods: result.submittionMethods },
      rooms: result.rooms,
    };
  } catch (e) {
    return { status: "error", settings: null, rooms: null };
  }
});
