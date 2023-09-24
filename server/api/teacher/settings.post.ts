import { loadUser } from "@/server/middleware/authenticate";
import prisma from "@/server/prisma";
import type { UserSettings } from "@/components/teacher/SettingsPage.vue";

export default eventHandler(async (event) => {
  const { uid } = await loadUser(event);
  const data = await readBody<UserSettings>(event);
  try {
    await prisma.$transaction([
      prisma.submittionMethods.deleteMany({
        where: { teacherUid: uid },
      }),
      ...data.submittionMethods.map((method, index) =>
        prisma.submittionMethods.create({
          data: {
            index,
            method,
            teacherUid: uid,
          },
        }),
      ),
    ]);
    return { status: "success" };
  } catch (e) {
    return { status: "error" };
  }
});
