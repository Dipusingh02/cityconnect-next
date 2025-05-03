import { NextRequest, NextResponse } from 'next/server';
import Project from '@/models/project';
import { authenticateRequest } from '@/lib/auth'; // Adjust this import path based on actual location

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  // Validate project ID
  if (typeof id !== 'string') {
    return NextResponse.json({ message: 'Invalid project ID' }, { status: 400 });
  }

  try {
    // Authenticate the request
    const user = authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { total, utilized } = await req.json();

    if (!total || !utilized) {
      return NextResponse.json(
        { message: 'Total and utilized budget are required' },
        { status: 400 }
      );
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { 'budget.total': total, 'budget.utilized': utilized },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProject.budget, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating project budget:', message);
    return NextResponse.json(
      { message: 'Error updating project budget', error: message },
      { status: 500 }
    );
  }
};
