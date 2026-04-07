'use client';

import { useEffect, useRef } from "react";
import { Terminal as TerminalIcon } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'agent';
}

interface TerminalLogProps {
  logs: LogEntry[];
}

export function TerminalLog({ logs }: TerminalLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden font-mono text-xs">
      <div className="bg-muted/30 px-4 py-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-muted-foreground" />
          <span className="text-[11px] font-medium text-foreground">Activity Log</span>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth"
      >
        {logs.length === 0 ? (
          <div className="text-muted-foreground">Waiting for activity...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-3 group">
              <span className="text-[10px] text-muted-foreground min-w-[70px] select-none">[{log.timestamp}]</span>
              <span className="text-[10px] text-muted-foreground min-w-[80px] select-none uppercase">{log.source}</span>
              <span className={clsx(
                "flex-1 leading-relaxed break-all",
                log.type === 'error' && "text-destructive",
                log.type !== 'error' && "text-foreground"
              )}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function clsx(...args: any[]) {
  return args.filter(Boolean).join(' ');
}