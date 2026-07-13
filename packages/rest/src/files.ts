import { createReadStream } from 'node:fs';
import { basename } from 'node:path';
import { Readable } from 'node:stream';

/**
 * A concrete file to upload, pairing raw bytes/stream with a filename. Produced by
 * {@link fileFrom} and accepted anywhere the API expects an `InputFile`.
 */
export interface UploadableFile {
  name: string;
  data: Blob | Buffer | Readable;
}

/** Build an {@link UploadableFile} from a local path (filename inferred) or explicit bytes. */
export function fileFrom(source: string | Buffer | Blob | Readable, name?: string): UploadableFile {
  if (typeof source === 'string') {
    return { name: name ?? basename(source), data: createReadStream(source) };
  }
  return { name: name ?? 'file', data: source };
}

/** True if a value is raw file content that must be uploaded via multipart form-data. */
export function isUploadable(value: unknown): value is Buffer | Blob | Readable | UploadableFile {
  if (value == null) return false;
  if (Buffer.isBuffer(value)) return true;
  if (typeof Blob !== 'undefined' && value instanceof Blob) return true;
  if (value instanceof Readable) return true;
  if (typeof value === 'object' && 'data' in value && 'name' in value) {
    const data = (value as UploadableFile).data;
    return Buffer.isBuffer(data) || data instanceof Readable || (typeof Blob !== 'undefined' && data instanceof Blob);
  }
  return false;
}

/** Read a Node stream fully into a Buffer. */
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

/** Normalise any uploadable value into a `{ blob, name }` pair suitable for FormData. */
export async function toBlob(value: Buffer | Blob | Readable | UploadableFile): Promise<{ blob: Blob; name: string }> {
  let name = 'file';
  let data: Buffer | Blob | Readable = value as Buffer | Blob | Readable;

  if (typeof value === 'object' && 'data' in value && 'name' in value) {
    name = (value as UploadableFile).name;
    data = (value as UploadableFile).data;
  }

  if (data instanceof Readable) return { blob: new Blob([await streamToBuffer(data)]), name };
  if (Buffer.isBuffer(data)) return { blob: new Blob([data]), name };
  return { blob: data, name }; // already a Blob
}
