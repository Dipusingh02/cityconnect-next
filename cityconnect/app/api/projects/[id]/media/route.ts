import { NextRequest, NextResponse } from 'next/server';
import { createRouter } from 'next-connect';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import dbConnect from '@/lib/db';
import Project from '@/models/project';

// Define the type for the enhanced request with files
interface NextRequestWithFiles extends NextRequest {
  files?: Express.Multer.File[];
}

// Configure multer for file storage
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed!'));
    }
  },
});

// Create middleware to handle file uploads
const multerUpload = promisify(upload.array('files', 5));

// Create router
const router = createRouter<NextRequestWithFiles, NextResponse>();

// Middleware to run multer
router.use(async (req, res, next) => {
  try {
    // @ts-ignore - Needed because multer expects a different request format
    await multerUpload(req, res);
    return next();
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'File upload error' },
      { status: 400 }
    );
  }
});

// POST handler for uploading files
router.post(async (req, res) => {
  try {
    await dbConnect();
    const projectId = req.url.split('/projects/')[1].split('/media')[0];

    if (!req.files || req.files.length === 0) {
      return NextResponse.json({ success: false, message: 'No files uploaded' }, { status: 400 });
    }

    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);

    // Update project with new media files
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $push: { media: { $each: fileUrls } } },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Files uploaded successfully', 
      files: fileUrls 
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Server error' }, 
      { status: 500 }
    );
  }
});

// DELETE handler for removing a file
router.delete(async (req, res) => {
  try {
    await dbConnect();
    const projectId = req.url.split('/projects/')[1].split('/media')[0];
    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return NextResponse.json({ success: false, message: 'File URL is required' }, { status: 400 });
    }

    // Remove file from project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { media: fileUrl } },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), 'public', fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'File deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Server error' }, 
      { status: 500 }
    );
  }
});

// GET handler for fetching project media
router.get(async (req, res) => {
  try {
    await dbConnect();
    const projectId = req.url.split('/projects/')[1].split('/media')[0];

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      media: project.media || [] 
    });
  } catch (error) {
    console.error('Error getting project media:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Server error' }, 
      { status: 500 }
    );
  }
});

// Handler for route.ts
export async function GET(req: NextRequest) {
  return router.run(req, NextResponse.next());
}

export async function POST(req: NextRequest) {
  return router.run(req, NextResponse.next());
}

export async function DELETE(req: NextRequest) {
  return router.run(req, NextResponse.next());
}