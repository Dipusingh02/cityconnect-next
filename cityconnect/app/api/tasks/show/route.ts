import { NextResponse } from 'next/server';
import Task from '../../../../models/task';

// GET: Fetch all tasks
export const GET = async () => {
  try {
    const tasks = await Task.find().populate('workerId', 'name email');
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving tasks', error: error.message }, { status: 500 });
  }
};
