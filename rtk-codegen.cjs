/** @type {import('@rtk-query/codegen-openapi').ConfigFile} */
const config = {
  schemaFile: process.env.RTK_QUERY_SCHEMA_PATH || "./schema.json",

  apiFile: "./src/shared/store/baseApi.ts",
  apiImport: "baseApi",

  outputFiles: {
    "./src/features/auth/authApi.ts": {
      filterEndpoints: (_, { path }) => path.startsWith("/api/auth"),
      exportName: "authApi",
    },
    // "./src/features/user/userApi.ts": {
    //   filterEndpoints: [/User/i],
    // },
  },

  hooks: true,
};

module.exports = config;
