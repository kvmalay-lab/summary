'use client';

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
}

export function ChatInterface({ messages, onSendMessage, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <Card className="flex flex-col h-full bg-card border border-border overflow-hidden shadow-none">
      <div className="p-4 border-b border-border bg-muted/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm text-foreground">Iterative Workspace</h3>
        </div>
        <div className="text-[10px] font-mono px-2 py-0.5 border border-border rounded text-muted-foreground bg-background">
          CONTEXT_AWARE
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50 space-y-4">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm font-sans text-muted-foreground">Awaiting initial content generation session...</p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex gap-4 group",
                  m.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                  m.role === 'user' ? "bg-background border-border" : "bg-muted border-border"
                )}>
                  {m.role === 'user' ? <User className="w-4 h-4 text-foreground" /> : <Bot className="w-4 h-4 text-foreground" />}
                </div>
                <div className={cn(
                  "flex flex-col max-w-[85%] space-y-1",
                  m.role === 'user' ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "px-4 py-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap font-sans border",
                    m.role === 'user' ? "bg-primary text-primary-foreground border-transparent" : "bg-card border-border text-foreground"
                  )}>
                    {m.content}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-foreground" />
              </div>
              <div className="bg-card border border-border px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <RefreshCw className="w-3 h-3 animate-spin text-muted-foreground" />
                <span className="font-sans text-muted-foreground text-sm">Agent pipeline refining content...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 bg-background border-t border-border">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command the agents (e.g., 'make it more formal', 'summarize this into 3 bullets')..."
            className="bg-background border-border focus-visible:ring-primary h-11"
            disabled={isLoading || messages.length === 0}
          />
          <Button type="submit" size="icon" className="h-11 w-11 shrink-0" disabled={isLoading || !input.trim() || messages.length === 0}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}