import { NextRequest, NextResponse } from 'next/server';
import Project from '@/models/project';
import { authenticateToken } from '@/lib/auth';

export const PUT = authenticateToken(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const projectId = params.id;
  const { startDate, deadline } = await req.json();

  try {
    const project = await Project.findById(projectId);
    if (!project) return NextResponse.json({ message: 'Project not found' }, { status: 404 });

    const newStartDate = new Date(startDate || new Date());
    const newDeadline = new Date(deadline || new Date(newStartDate.getTime() + 7 * 24 * 60 * 60 * 1000));

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { startDate: newStartDate, deadline: newDeadline },
      { new: true }
    );

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating timeline', error: error.message }, { status: 500 });
  }
});
