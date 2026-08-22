import path from 'path';

export interface IStorageService {
  uploadFile(file: Express.Multer.File, userId: string): Promise<string>;
}

export class LocalStorageService implements IStorageService {
  async uploadFile(file: Express.Multer.File, userId: string): Promise<string> {
    // In local storage, Multer already writes the file to the disk.
    // We just return the public URL to access it.
    return `/uploads/resumes/${file.filename}`;
  }
}

export class S3StorageService implements IStorageService {
  async uploadFile(file: Express.Multer.File, userId: string): Promise<string> {
    // TODO: Implement AWS SDK S3 upload
    // 1. Read file.path
    // 2. Upload to S3 bucket
    // 3. Return S3 public URL
    throw new Error("S3 Storage not implemented yet");
  }
}

// Factory to return the appropriate service based on env
export const getStorageService = (): IStorageService => {
  if (process.env.STORAGE_PROVIDER === 's3') {
    return new S3StorageService();
  }
  return new LocalStorageService();
};
