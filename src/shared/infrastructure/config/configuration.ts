export default () => ({
  port: parseInt(process.env.PORT ?? '8080', 10),
  mongo: {
    uri: process.env.MONGO_URI,
  },
  prisma: {
    url: process.env.PRISMA_URL,
  },
});
