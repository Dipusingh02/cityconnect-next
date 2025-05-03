import { NextRequest, NextResponse } from 'next/server';
import Project from '@/models/project';
import { authenticateToken } from '@/lib/auth';

export const POST = authenticateToken(async (req: NextRequest) => {
  const { projectCode, title, objective, description, scopeOfWork, technologiesUsed, departments, location, status, startDate, deadline, budget, leadDepartment } = await req.json();

  try {
    if (!projectCode || !title || !objective || !description || !location || !budget || !leadDepartment) {
      return NextResponse.json({ message: 'Required fields missing' }, { status: 400 });
    }

    const parsedStartDate = new Date(startDate);
    const parsedDeadline = new Date(deadline);

    const newProject = new Project({
      workerId: req.user?.userId,
      projectCode,
      title,
      objective,
      description,
      scopeOfWork,
      technologiesUsed,
      departments,
      location,
      status,
      startDate: parsedStartDate,
      deadline: parsedDeadline,
      budget,
      leadDepartment
    });

    await newProject.save();

    return NextResponse.json({ message: 'Project created successfully', project: newProject }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating project', error: error.message }, { status: 500 });
  }
});
