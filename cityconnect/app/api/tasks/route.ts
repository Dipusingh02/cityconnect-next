import { NextRequest, NextResponse } from 'next/server';
import Task from '@/models/task';
import { authenticateToken } from '@/lib/auth';

export const POST = async (req: NextRequest) => {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ message: 'No token provided' }, { status: 403 });

    const decoded = await authenticateToken(token); // { userId: ... }

    const {
      title,
      description,
      dueDate,
      department,
      status,
      dependencies
    } = await req.json();

    if (!title || !description || !department) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    let parsedDependencies = dependencies;
    if (typeof dependencies === 'string') {
      parsedDependencies = dependencies.split(',').map(dep => dep.trim());
    }

    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      return NextResponse.json({ message: 'Invalid due date format.' }, { status: 400 });
    }

    const newTask = new Task({
      workerId: decoded.userId,
      title,
      description,
      dueDate: parsedDueDate,
      department,
      status: status || 'In Progress',
      dependencies: parsedDependencies
    });

    await newTask.save();

    return NextResponse.json({ message: 'Task created successfully', task: newTask }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error creating task', error: error.message }, { status: 400 });
  }
};
