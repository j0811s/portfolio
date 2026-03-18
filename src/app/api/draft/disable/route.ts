import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  const draft = await draftMode();
  draft.disable();

  const cookieStore = await cookies();
  cookieStore.delete('draft_key');

  redirect('/');
}
