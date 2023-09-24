import { loadUser } from "@/server/middleware/authenticate";
import prisma from "@/server/prisma";
import type { Assignment } from "@/types/assignments";

export default eventHandler(async (event) => {
  const { uid } = await loadUser(event);
  const data = await readBody<number[]>(event);
  try {
    await prisma.assignments.updateMany({
      where: {
        id: {
          in: data,
        },
      },
      data: {
        isDeleted: true,
      },
    });
    return { status: "success" };
  } catch (e) {
    return { status: "error" };
  }
});
