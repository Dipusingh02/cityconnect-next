import { NextRequest, NextResponse } from 'next/server';
import Project from '@/models/project';
import { authenticateToken } from '@/lib/auth';

export const POST = authenticateToken(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const projectId = params.id;
  const { title, description, startDate, endDate, status, completionPercentage, completed } = await req.json();

  try {
    const project = await Project.findById(projectId);
    if (!project) return NextResponse.json({ message: 'Project not found' }, { status: 404 });

    const milestone = { title, description, startDate, endDate, status, completionPercentage, completed };
    project.milestones.push(milestone);
    await project.save();

    return NextResponse.json(project.milestones[project.milestones.length - 1], { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error adding milestone', error: error.message }, { status: 500 });
  }
});
