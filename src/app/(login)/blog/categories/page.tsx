import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

export default async function Page() {
  return notFound();
}
