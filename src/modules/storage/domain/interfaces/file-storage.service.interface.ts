export const IFileStorage = Symbol('IFileStorage');

export interface IFileStorage {
  createUploadUrl(path: string): Promise<{
    path: string;
    token: string;
    signedUrl: string;
  }>;

  createDownloadUrl(path: string): Promise<string>;

  delete(path: string): Promise<void>;
}
