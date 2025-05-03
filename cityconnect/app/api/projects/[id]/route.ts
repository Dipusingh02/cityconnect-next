import { NextResponse,NextRequest } from 'next/server';
import Project from '../../../../models/project';

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const projectId = params.id;

  try {
    const project = await Project.findById(projectId).populate('workerId', 'name email');
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving project', error: error.message }, { status: 500 });
  }
};
