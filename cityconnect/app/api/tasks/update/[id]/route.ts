import { NextRequest, NextResponse } from 'next/server';
import Task from '@/models/task';
// import { authenticateToken } from '@/middleware/authenticateToken'; // Uncomment if you plan to use it

// PUT: Update task status
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  const { status } = await req.json();

  if (!status) return NextResponse.json({ message: 'Task status is required.' }, { status: 400 });

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedTask) return NextResponse.json({ message: 'Task not found.' }, { status: 404 });

    return NextResponse.json({ message: 'Task status updated successfully', task: updatedTask });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ message: 'Error updating task', error: err.message }, { status: 400 });
  }
};
