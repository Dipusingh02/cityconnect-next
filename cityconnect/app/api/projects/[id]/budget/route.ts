import { NextRequest, NextResponse } from 'next/server';
import Project from '@/models/project';
import { authenticateToken } from '@/lib/auth';

export const PUT = authenticateToken(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const projectId = params.id;
  const { total, utilized } = await req.json();

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { 'budget.total': total, 'budget.utilized': utilized },
      { new: true }
    );

    return NextResponse.json(updatedProject.budget, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating budget', error: error.message }, { status: 500 });
  }
});
