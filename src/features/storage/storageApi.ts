import { baseApi as api } from "../../shared/store/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    storageControllerPresign: build.mutation<
      StorageControllerPresignApiResponse,
      StorageControllerPresignApiArg
    >({
      query: (queryArg) => ({
        url: `/api/storage/files/presign`,
        method: "POST",
        body: queryArg.presignDto,
      }),
    }),
    storageControllerUploadImage: build.mutation<
      StorageControllerUploadImageApiResponse,
      StorageControllerUploadImageApiArg
    >({
      query: (queryArg) => ({
        url: `/api/storage/images/upload`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as storageApi };
export type StorageControllerPresignApiResponse = unknown;
export type StorageControllerPresignApiArg = {
  presignDto: PresignDto;
};
export type StorageControllerUploadImageApiResponse = unknown;
export type StorageControllerUploadImageApiArg = {
  body: {
    file?: Blob;
  };
};
export type PresignDto = {
  /** Original file name */
  filename: string;
  /** Target folder in storage */
  folder: string;
};
export const {
  useStorageControllerPresignMutation,
  useStorageControllerUploadImageMutation,
} = injectedRtkApi;
