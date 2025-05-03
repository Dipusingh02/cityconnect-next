import { NextRequest,NextResponse} from 'next/server';
import dbConnect from '@/lib/db';
import Issue from '@/models/issues'
export async function POST(req: NextRequest, { params }: { params: { issueId: string } }) {
    try {
      await dbConnect();
      const { user, comment } = await req.json();
  
      if (!user || !comment) {
        return NextResponse.json({ error: 'User and comment are required' }, { status: 400 });
      }
  
      const issue = await Issue.findById(params.issueId);
      if (!issue) {
        return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
      }
  
      issue.publicFeedback.push({ user, comment, date: new Date() });
      const updatedIssue = await issue.save();
  
      return NextResponse.json(updatedIssue, { status: 201 });
    } catch (error) {
      console.error('Error adding comment:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  