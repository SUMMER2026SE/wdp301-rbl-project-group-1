/** @type {import('@rtk-query/codegen-openapi').ConfigFile} */
const config = {
  schemaFile: process.env.RTK_QUERY_SCHEMA_PATH || "./schema.json",

  apiFile: "./src/shared/store/baseApi.ts",
  apiImport: "baseApi",

  outputFiles: {
    // "./src/features/auth/authApi.ts": {
    //   filterEndpoints: (_, { path }) => path.startsWith("/api/auth"),
    //   exportName: "authApi",
    // },
    "./src/features/user/userApi.ts": {
      filterEndpoints: (_, { path }) => path.startsWith("/api/users"),
      exportName: "userApi",
    },
    "./src/features/tutor-application/tutorApplicationApi.ts": {
      filterEndpoints: (_, { path }) =>
        path.startsWith("/api/tutor-application"),
      exportName: "tutorApplicationApi",
    },
    "./src/features/academic-catalog/academicCatalogApi.ts": {
      filterEndpoints: (_, { path }) =>
        path.startsWith("/api/grades") || path.startsWith("/api/subjects"),
      exportName: "academicCatalogApi",
    },
    "./src/features/storage/storageApi.ts": {
      filterEndpoints: (_, { path }) => path.startsWith("/api/storage"),
      exportName: "storageApi",
    }
  },

  hooks: true,
};

module.exports = config;
