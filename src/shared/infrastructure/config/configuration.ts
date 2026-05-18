export default () => ({
  port: parseInt(process.env.PORT ?? '8080', 10),
  mongo: {
    uri: process.env.MONGO_URI,
  },
  prisma: {
    url: process.env.PRISMA_URL,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  auth: {
    secretKey: process.env.SECRET_KEY,
    resetSecretKey: process.env.RESET_SECRET_KEY,
    refreshSecretKey: process.env.REFRESH_SECRET_KEY,
    accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES,
    defaultTokenExpires: process.env.DEFAULT_TOKEN_EXPIRES,
    refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES,
    cookieExpires: process.env.COOKIE_EXPIRES,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    bucket: process.env.SUPABASE_BUCKET,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT ?? '587', 10),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  payos: {
    clientId: process.env.PAYOS_CLIENT_ID,
    apiKey: process.env.PAYOS_API_KEY,
    checksumKey: process.env.PAYOS_CHECKSUM_KEY,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL,
  },
});
