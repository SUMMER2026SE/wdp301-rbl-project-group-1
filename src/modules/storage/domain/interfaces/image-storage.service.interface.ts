import { Readable } from 'node:stream';

export const IImageStorage = Symbol('IImageStorage');

export interface IImageStorage {
  upload(stream: Readable, publicId: string, image?: boolean): Promise<string>;
}
