import { loadUser } from "@/server/middleware/authenticate";
import prisma from "@/server/prisma";
import type { Assignment } from "@/types/assignments";
import type { Prisma } from "@prisma/client";

export default eventHandler(async (event) => {
  const { uid } = await loadUser(event);
  const data = await readBody<Assignment>(event);
  try {
    const result = await prisma.$transaction(async (tx) => {
      const { serial } = (await tx.assignments.findFirst({
        select: {
          serial: true,
        },
        where: {
          teacherUid: uid,
        },
        orderBy: {
          serial: "desc",
        },
      })) || { serial: 1 };

      const create = await tx.assignments.create({
        select: {
          serial: true,
        },
        data: {
          teacherUid: uid,
          serial: serial + 1,
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
      return create.serial;
    });
    return { status: "success", serial: `${result}` };
  } catch (e) {
    return { status: "error", serial: null };
  }
});
