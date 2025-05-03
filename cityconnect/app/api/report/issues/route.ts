import  dbConnect  from '@/lib/db';
import Issue from '@/models/issues';
import Project from '@/models/project';
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

interface IssueData {
  title: string;
  description: string;
  department: string;
  location: string;
  status: string;
  attachment?: string | null;
  project?: string;
  projectName?: string;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const department = formData.get('department') as string;
    const location = formData.get('location') as string;
    const status = formData.get('status') as string;
    const projectId = formData.get('projectId') as string;
    const file = formData.get('attachment') as File;

    let attachment: string | null = null;
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `./public/uploads/${fileName}`;
      await writeFile(filePath, buffer);
      attachment = `/uploads/${fileName}`;
    }

    const issueData: IssueData = {
      title,
      description,
      department,
      location,
      status,
      attachment
    };

    if (projectId && projectId !== 'none') {
      issueData.project = projectId;
      const project = await Project.findById(projectId);
      if (project) issueData.projectName = project.title;
    }

    const issue = new Issue(issueData);
    await issue.save();

    return NextResponse.json({ message: 'Issue reported successfully!', issue }, { status: 201 });
  } catch (error) {
    console.error('Error reporting issue:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
