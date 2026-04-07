'use client';

import { useState, useEffect } from "react";
import { AgentTopology } from "@/components/agent-topology";
import { TerminalLog } from "@/components/terminal-log";
import { ChatInterface } from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layers, Plus, History, Command, Settings, HelpCircle, Activity } from "lucide-react";
import { startSession, sendCommand } from "@/app/actions/agent-actions";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'agent';
}

export default function AgenticCanvasDashboard() {
  const [topic, setTopic] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    // Basic terminal welcome
    addLog('SYSTEM', 'Core initialization complete. Ready for new tasking.', 'success');
  }, []);

  const addLog = (source: string, message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      source,
      message,
      type
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isProcessing) return;

    const newSessionId = `sess_${Date.now()}`;
    setSessionId(newSessionId);
    setIsProcessing(true);
    setCurrentStep(0);
    setMessages([]);
    setLogs([]);

    addLog('SYSTEM', `Initiating Agentic Pipeline for topic: "${topic}"`, 'info');
    
    // Simulate progression of steps for visual feedback
    const steps = [
      { source: 'COLLECTOR', msg: 'Gathering raw source data from verified streams...', delay: 2000 },
      { source: 'SUMMARIZER', msg: 'Context analysis in progress. Extracting vector embeddings...', delay: 4000 },
      { source: 'WRITER', msg: 'Synthesizing structured draft. Applying template constraints...', delay: 6000 },
      { source: 'EDITOR', msg: 'Final polish & coherence check. Output generation ready.', delay: 8000 }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setCurrentStep(idx);
        addLog(step.source, step.msg, 'agent');
      }, step.delay);
    });

    const result = await startSession(topic, newSessionId);

    setTimeout(() => {
      setIsProcessing(false);
      if (result.success && result.content) {
        setMessages([{
          id: 'initial',
          role: 'assistant',
          content: result.content
        }]);
        addLog('SYSTEM', 'Pipeline execution successful. Final artifacts committed to session.', 'success');
      } else {
        addLog('SYSTEM', `Pipeline failure: ${result.error}`, 'error');
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: result.error || "An unknown error occurred during the agent pipeline execution."
        });
      }
    }, 9000);
  };

  const handleSendMessage = async (input: string) => {
    setIsProcessing(true);
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: input }]);
    addLog('USER', `Instruction received: ${input}`, 'info');

    const result = await sendCommand(sessionId, input, messages[messages.length - 1]?.content || "", messages);

    setIsProcessing(false);
    if (result.success && result.content) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: result.content! }]);
      addLog('EDITOR', 'Content refined based on user instructions.', 'success');
    } else {
      addLog('SYSTEM', `Refinement error: ${result.error}`, 'error');
    }
  };

  return (
    <div className="flex h-screen w-full bg-background font-body overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-16 flex flex-col items-center py-6 bg-card/40 border-r border-border shrink-0">
        <div className="mb-10 text-primary">
          <Layers className="w-8 h-8" />
        </div>
        <nav className="flex flex-col gap-6">
          <Button variant="ghost" size="icon" className="text-primary bg-primary/10 border border-primary/20"><Plus className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><History className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><Activity className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><Settings className="w-5 h-5" /></Button>
        </nav>
        <div className="mt-auto flex flex-col gap-6">
          <Button variant="ghost" size="icon" className="text-muted-foreground"><HelpCircle className="w-5 h-5" /></Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header / Prompt Area */}
        <header className="p-4 border-b border-border bg-card/20">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
            <div className="flex-1">
              <form onSubmit={handleStartSession} className="relative group">
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="ENTER TARGET TOPIC FOR AGENTIC SYNTHESIS..."
                  className="bg-black/40 border-border group-focus-within:border-primary transition-all font-code pl-12 h-12 text-sm tracking-wide"
                  disabled={isProcessing}
                />
                <Command className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Button 
                  type="submit" 
                  disabled={isProcessing || !topic.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-4 font-code text-[11px]"
                >
                  {isProcessing ? 'PROCESSING...' : 'INITIALIZE PIPELINE'}
                </Button>
              </form>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-code text-muted-foreground uppercase">Cloud Sync Status</span>
                <span className="text-xs font-code text-secondary">CONNECTED // 0ms Latency</span>
              </div>
              <div className="w-10 h-10 rounded bg-muted/50 border border-border flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              </div>
            </div>
          </div>
        </header>

        {/* Triple Panel Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Topology Dashboard */}
          <div className="w-1/4 p-4 flex flex-col gap-4 border-r border-border min-w-[300px]">
            <AgentTopology currentStep={currentStep} isProcessing={isProcessing} />
          </div>

          {/* Middle Panel: Chat Workspace */}
          <div className="flex-1 p-4 flex flex-col min-w-[500px]">
            <ChatInterface 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              isLoading={isProcessing} 
            />
          </div>

          {/* Right Panel: Terminal Logs */}
          <div className="w-1/4 p-4 flex flex-col min-w-[320px]">
            <TerminalLog logs={logs} />
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}