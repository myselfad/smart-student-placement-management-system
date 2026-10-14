import fs from "fs";

export interface IStorageService {
  uploadFile(file: Express.Multer.File, userId: string): Promise<string>;
}

export class LocalStorageService implements IStorageService {
  async uploadFile(file: Express.Multer.File, _userId: string): Promise<string> {
    // In local storage, Multer writes the file to disk; return the public URL
    return `/uploads/resumes/${file.filename}`;
  }
}

export class SupabaseStorageService implements IStorageService {
  private supabaseUrl: string;
  private serviceKey: string;
  private bucket: string;

  constructor() {
    this.supabaseUrl = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
    this.serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    this.bucket = process.env.SUPABASE_STORAGE_BUCKET || "resumes";
  }

  async uploadFile(file: Express.Multer.File, userId: string): Promise<string> {
    if (!this.supabaseUrl || !this.serviceKey) {
      throw new Error("Supabase Storage is not configured (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)");
    }

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storageKey = `${userId}/${uniqueSuffix}-${sanitizedName}`;

    const endpoint = `${this.supabaseUrl}/storage/v1/object/${this.bucket}/${storageKey}`;
    const fileBuffer = fs.readFileSync(file.path);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.serviceKey}`,
        "Content-Type": file.mimetype || "application/octet-stream",
        "x-upsert": "true",
      },
      body: fileBuffer,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[Supabase Storage Error]", errText);
      throw new Error(`Failed to upload to Supabase Storage: ${response.statusText}`);
    }

    // Return the public URL for the uploaded object in the bucket
    return `${this.supabaseUrl}/storage/v1/object/public/${this.bucket}/${storageKey}`;
  }
}

// Factory to return the appropriate service based on environment
export const getStorageService = (): IStorageService => {
  const isSupabaseConfigured = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (process.env.STORAGE_PROVIDER === "supabase" || isSupabaseConfigured) {
    return new SupabaseStorageService();
  }
  return new LocalStorageService();
};
