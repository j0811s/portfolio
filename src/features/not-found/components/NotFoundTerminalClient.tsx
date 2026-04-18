'use client';

import dynamic from 'next/dynamic';

const NotFoundTerminalDynamic = dynamic(
  () => import('./NotFoundTerminal').then((m) => ({ default: m.NotFoundTerminal })),
  { ssr: false }
);

export function NotFoundTerminalClient() {
  return <NotFoundTerminalDynamic />;
}
