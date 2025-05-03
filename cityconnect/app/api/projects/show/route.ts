import { NextResponse } from 'next/server';
import Project from '../../../../models/project';

export const GET = async () => {
  try {
    const projects = await Project.find().populate('workerId', 'name email');
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving projects', error: error.message }, { status: 500 });
  }
};
