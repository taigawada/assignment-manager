import { loadUser } from "@/server/middleware/authenticate";
import prisma from "@/server/prisma";

export default eventHandler(async (event) => {
  const { uid } = await loadUser(event);
  try {
    const settings = await prisma.teachers.findUnique({
      select: {
        submittionMethods: {
          orderBy: {
            index: "asc",
          },
        },
      },
      where: { uid },
    });
    return { status: "success", settings };
  } catch (e) {
    return { status: "error", settings: null };
  }
});
