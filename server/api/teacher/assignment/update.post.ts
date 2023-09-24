import { loadUser } from "@/server/middleware/authenticate";
import prisma from "@/server/prisma";
import type { Assignment } from "@/types/assignments";
import type { Prisma } from "@prisma/client";

export default eventHandler(async (event) => {
  const { uid } = await loadUser(event);
  const data = await readBody<Assignment>(event);
  try {
    const update = await prisma.assignments.update({
      where: {
        teacherUid: uid,
        id: data.id,
      },
      data: {
        teacherUid: uid,
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        status: data.status,
        releaseDate: data.releaseDate,
        submittionMethod: data.submittionMethod
          ? data.submittionMethod
          : data.otherSubmittionMethod,
        isRepeat: data.isRepeat,
        submitOnHoliday: data.submitOnHoliday,
        assignedClasses: {
          connect: data.assignedClasses!.map((classElm) => ({
            id: classElm.id,
          })),
        },
        cyclePeriod: data.cyclePeriod as unknown as Prisma.JsonArray,
      },
    });
    return { status: "success" };
  } catch (e) {
    return { status: "error" };
  }
});
