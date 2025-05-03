import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import formidable, { Part, Files, File } from 'formidable';
import { IncomingMessage } from 'http';
import { Readable } from 'stream';

import dbConnect from '@/lib/db';
import Project from '@/models/project';
import { authenticateToken } from '@/lib/auth';

export const config = {
  api: {
    bodyParser: false
  }
};

const uploadDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Helper to convert Fetch API's Request to Node's IncomingMessage
async function streamToIncomingMessage(request: Request): Promise<IncomingMessage> {
  const reader = request.body?.getReader();
  const stream = new Readable({
    async read() {
      if (!reader) return this.push(null);
      const { done, value } = await reader.read();
      if (done) this.push(null);
      else this.push(value);
    }
  });

  const incoming = Object.assign(stream, {
    headers: Object.fromEntries(request.headers.entries()),
    method: request.method,
    url: request.url
  });

  return incoming as IncomingMessage;
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ message: 'No token provided' }, { status: 403 });
  }

  try {
    await authenticateToken(token);
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
  }

  const form = formidable({
    multiples: true,
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    filename: (_name: string, _ext: string, part: Part) => {
      return `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(part.originalFilename || '')}`;
    },
    filter: (part: Part) => {
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif',
        'application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      return allowedTypes.includes(part.mimetype || '');
    }
  });

  const incomingReq = await streamToIncomingMessage(req);
  const { files } = await new Promise<{ files: Files }>((resolve, reject) => {
    form.parse(incomingReq, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ files });
    });
  });

  await dbConnect();
  const project = await Project.findById(params.id);
  if (!project) {
    Object.values(files)
      .flat()
      .filter((file): file is File => file !== undefined)
      .forEach((file: File) => {
        fs.unlinkSync(file.filepath);
      });

    return NextResponse.json({ message: 'Project not found' }, { status: 404 });
  }

  const uploadedPaths = Object.values(files)
    .flat()
    .filter((file): file is File => file !== undefined)
    .map((file: File) => `/uploads/${path.basename(file.filepath)}`);

  project.media.push(...uploadedPaths);
  await project.save();

  return NextResponse.json({ message: 'Media uploaded successfully', media: uploadedPaths });
}
