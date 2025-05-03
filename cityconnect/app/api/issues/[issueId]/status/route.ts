import { NextRequest,NextResponse} from 'next/server';
import dbConnect from '@/lib/db';
import Issue from '@/models/issues'
export async function PUT(req: NextRequest, { params }: { params: { issueId: string } }) {
    try {
      await dbConnect();
      const { status } = await req.json();
      if (!['Pending', 'In Progress', 'Resolved', 'Rejected'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
      }
  
      const updatedIssue = await Issue.findByIdAndUpdate(params.issueId, { status }, { new: true });
      if (!updatedIssue) {
        return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
      }
  
      return NextResponse.json(updatedIssue);
    } catch (error) {
      console.error('Error updating issue status:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }