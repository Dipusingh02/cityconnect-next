import { dbConnect } from '@/lib/db';
import Project from '@/models/project';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}, { _id: 1, title: 1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}