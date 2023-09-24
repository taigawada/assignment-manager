import { admin } from "../../firebase";
import { loadUser } from "../../middleware/authenticate";
import prisma from "../../prisma";

export default eventHandler(async (event) => {
  const { uid } = await loadUser(event);
  try {
    const select = {
      uid: true,
      name: true,
      submittionMethods: true,
      assignments: true,
    };
    const teacher = await prisma.teachers.findUnique({
      select,
      where: { uid },
    });
    if (!teacher) {
      const user = await admin.auth().getUser(uid);
      const [createTeacher] = await prisma.$transaction([
        prisma.teachers.create({
          select,
          data: {
            uid,
            name: user.displayName || "",
            submittionMethods: {
              create: [
                {
                  index: 1,
                  method: "朝の会で提出",
                },
                {
                  index: 2,
                  method: "帰りの会で提出",
                },
                {
                  index: 3,
                  method: "放課後に提出",
                },
              ],
            },
            rooms: {
              connect: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
            },
          },
        }),
      ]);
      return { status: "success", teacher: createTeacher };
    }
    return { status: "success", teacher };
  } catch (e) {
    return { status: "error", teacher: null };
  }
});
