'use client';

import type { ShellOptions } from '@wterm/just-bash';
import { BashShell } from '@wterm/just-bash';
import { Terminal, useTerminal } from '@wterm/react';
import '@wterm/react/css';
import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';
import styles from '@/src/components/styles/ui/TerminalWindow.module.css';

const NAV_MARKER = 'WTERM_NAV:';

interface TerminalWindowProps extends ShellOptions {
  title?: string;
  cols?: number;
  rows?: number;
  autoResize?: boolean;
}

export default function TerminalWindow({
  title = 'bash',
  cols = 80,
  rows = 24,
  autoResize = false,
  ...shellOptions
}: TerminalWindowProps) {
  const { ref, write } = useTerminal();
  const { push } = useRouter();
  const shellRef = useRef<BashShell | null>(null);
  const shellOptionsRef = useRef(shellOptions);

  const wrappedWrite = useCallback(
    (data: string) => {
      const match = data.match(new RegExp(`${NAV_MARKER}([^\\r\\n]+)`));
      if (match) {
        const visible = data.replace(new RegExp(`${NAV_MARKER}[^\\r\\n]*\\r?\\n?`), '');
        if (visible) {
          write(visible);
        }
        setTimeout(() => push(match[1]), 1000);
        return;
      }
      write(data);
    },
    [write, push]
  );

  const handleReady = useCallback(() => {
    if (shellRef.current) return;
    const shell = new BashShell(shellOptionsRef.current);
    shellRef.current = shell;
    shell.attach(wrappedWrite);
  }, [wrappedWrite]);

  const handleData = useCallback((data: string) => {
    shellRef.current?.handleInput(data);
  }, []);

  return (
    <div className={styles.window}>
      <div className={styles.titleBar}>
        <span className={styles.dotRed} />
        <span className={styles.dotYellow} />
        <span className={styles.dotGreen} />
        <span className={styles.title}>{title}</span>
      </div>
      <div
        className={styles.body}
        style={autoResize ? { height: `${rows * 17 + 24}px` } : undefined}
      >
        <Terminal
          ref={ref}
          cols={cols}
          rows={rows}
          autoResize={autoResize}
          style={autoResize ? { height: '100%' } : undefined}
          theme="portfolio"
          cursorBlink
          onReady={handleReady}
          onData={handleData}
        />
      </div>
    </div>
  );
}
