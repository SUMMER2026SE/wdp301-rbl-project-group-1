export default () => ({
  port: parseInt(process.env.PORT ?? '8080', 10),
  mongo: {
    uri: process.env.MONGO_URI,
  },
  prisma: {
    url: process.env.PRISMA_URL,
  },
  auth: {
    secretKey: process.env.SECRET_KEY,
    refreshSecretKey: process.env.REFRESH_SECRET_KEY,
    accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES,
    defaultTokenExpires: process.env.DEFAULT_TOKEN_EXPIRES,
    refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES,
    cookieExpires: process.env.COOKIE_EXPIRES,
  },
});
