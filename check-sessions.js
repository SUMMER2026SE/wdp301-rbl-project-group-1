const { PrismaClient } = require('./generated/prisma/client');
const prisma = new PrismaClient();
async function main() {
  const sessions = await prisma.session.findMany({
    select: { id: true, isRescheduled: true, status: true, startTime: true }
  });
  console.log(sessions);
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
