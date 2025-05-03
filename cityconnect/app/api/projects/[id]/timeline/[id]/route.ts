import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/project";  // Adjust path as needed
import { authenticateToken } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const { startDate, deadline } = await req.json();
    const newStartDate = new Date(startDate || new Date());
    const newDeadline = new Date(deadline || new Date(newStartDate.getTime() + 7 * 24 * 60 * 60 * 1000)); // Default 1 week deadline

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { startDate: newStartDate, deadline: newDeadline },
      { new: true }
    );

    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ message: "Error updating timeline", error: error.message }, { status: 500 });
  }
}
