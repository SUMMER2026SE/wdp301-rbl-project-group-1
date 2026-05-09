import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
} from '@nestjs/common';

export const UploadedImage = (
  maxSizeMB = 5,
  fileType = '.(png|jpeg|jpg|webp)',
) => {
  return UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: maxSizeMB * 1024 * 1024 }),
        new FileTypeValidator({ fileType }),
      ],
    }),
  );
};
