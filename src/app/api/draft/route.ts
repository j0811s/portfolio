import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');
  const draftKey = searchParams.get('draftKey');

  if (!id || !draftKey) {
    return new Response('id and draftKey are required', { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(`/blog/${id}/?draftKey=${draftKey}`);
}
