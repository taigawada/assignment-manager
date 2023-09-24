import { loadUser } from "@/server/middleware/authenticate";
import prisma from "@/server/prisma";

export default eventHandler(async (event) => {
  const { uid } = await loadUser(event);
  const query = getQuery(event);
  const page = parseInt(typeof query.page === "string" ? query.page : "1", 10);
  const perPage = 10;
  try {
    const [count, assignments] = await prisma.$transaction([
      prisma.assignments.count({
        where: {
          teacherUid: uid,
          isDeleted: false,
        },
      }),
      prisma.assignments.findMany({
        where: {
          teacherUid: uid,
          isDeleted: false,
        },
        include: {
          assignedClasses: true,
        },
        take: 10,
        skip: (page - 1) * perPage,
      }),
    ]);
    return {
      status: "success",
      count,
      assignments,
    };
  } catch (e) {
    return { status: "error", count: 0, assignments: null };
  }
});
