import { NextRequest,NextResponse} from 'next/server';
import dbConnect from '@/lib/db';
import Issue from '@/models/issues'
export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    await dbConnect();
    const issues = await Issue.find({ project: params.projectId }).sort({ createdAt: -1 });
    return NextResponse.json(issues);
  } catch (error) {
    console.error('Error fetching issues by project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}