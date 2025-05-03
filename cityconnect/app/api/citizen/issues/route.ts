import { NextResponse} from 'next/server';
import dbConnect from '@/lib/db';
import Issue from '@/models/issues'
export async function GET() {
    try {
      await dbConnect();
      const issues = await Issue.find().sort({ createdAt: -1 });
      return NextResponse.json(issues);
    } catch (error) {
      console.error('Error fetching issues:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  