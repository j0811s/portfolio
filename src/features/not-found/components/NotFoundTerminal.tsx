import TerminalWindow from '@/src/components/ui/TerminalWindow';

const GREETING = [
  '$ find / -name "requested-page" 2>/dev/null',
  '\x1b[31mfind: "requested-page": No such file or directory\x1b[0m',
  '',
  '\x1b[33m  HTTP 404 — Page Not Found\x1b[0m',
  '',
  'Try: \x1b[36mls\x1b[0m, \x1b[36mcat README.md\x1b[0m',
].join('\r\n');

const FILES: Record<string, string> = {
  '/home/user/README.md':
    '# Portfolio\n\nWelcome! This page does not exist.\n\nAvailable scripts:\n  bash top.sh\n  bash blog.sh\n  bash contact.sh\n',
  '/home/user/top.sh': '#!/bin/bash\necho "[OK] Redirecting To /"\necho WTERM_NAV:/\n',
  '/home/user/blog.sh': '#!/bin/bash\necho "[OK] Redirecting To /blog/"\necho WTERM_NAV:/blog/\n',
  '/home/user/contact.sh':
    '#!/bin/bash\necho "[OK] Redirecting To /contact/"\necho WTERM_NAV:/contact/\n',
};

export function NotFoundTerminal() {
  return (
    <TerminalWindow
      title="bash — 404"
      autoResize={true}
      greeting={GREETING}
      files={FILES}
      cwd="/home/user"
      prompt={(cwd) => `\x1b[90m${cwd}\x1b[0m \x1b[32m❯\x1b[0m `}
      env={{ TERM: 'xterm-256color', USER: 'guest' }}
    />
  );
}
