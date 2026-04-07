'use client';

import { Check, Loader2, Search, FileText, PenTool, ClipboardCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const AGENTS = [
  { id: 'collector', name: 'News Collector', icon: Search, description: 'Curating baseline info' },
  { id: 'summarizer', name: 'Summarizer', icon: FileText, description: 'Extracting data points' },
  { id: 'writer', name: 'Content Writer', icon: PenTool, description: 'Drafting structured content' },
  { id: 'editor', name: 'Editor', icon: ClipboardCheck, description: 'Refining and finalizing' },
];

interface AgentTopologyProps {
  currentStep: number; // 0-3
  isProcessing: boolean;
}

export function AgentTopology({ currentStep, isProcessing }: AgentTopologyProps) {
  return (
    <div className="flex flex-col h-full bg-card border border-border p-6 rounded-lg shadow-none">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-sm font-sans font-medium text-foreground">Pipeline Topology</h2>
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", isProcessing ? "bg-primary" : "bg-muted-foreground")} />
          <span className="text-[10px] font-mono text-muted-foreground uppercase">{isProcessing ? "System Active" : "Standby"}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between relative py-4">
        {AGENTS.map((agent, index) => {
          const isActive = index === currentStep && isProcessing;
          const isCompleted = index < currentStep || (index === 3 && !isProcessing && currentStep === 3);
          const isPending = index > currentStep;

          return (
            <div key={agent.id} className="relative z-10">
              <div className={cn(
                "flex items-center gap-4 transition-all duration-300",
                isActive ? "opacity-100" : "opacity-60",
                isCompleted && "opacity-100"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded border flex items-center justify-center transition-colors duration-300",
                  isActive ? "border-primary bg-background text-primary" :
                  isCompleted ? "border-muted-foreground bg-muted text-muted-foreground" : "border-border bg-background text-muted-foreground"
                )}>
                  {isCompleted ? <Check className="w-5 h-5" /> :
                   isActive ? <Loader2 className="w-5 h-5 animate-spin" /> :
                   <agent.icon className="w-5 h-5" />}
                </div>
                
                <div className="flex flex-col">
                  <span className={cn(
                    "font-sans text-sm font-medium",
                    isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}>{agent.name}</span>
                  <span className="text-xs text-muted-foreground">{isActive ? "Processing..." : agent.description}</span>
                </div>

                {isCompleted && (
                  <div className="ml-auto">
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">VALIDATED</span>
                  </div>
                )}
              </div>

              {index < AGENTS.length - 1 && (
                <div className="ml-5 my-2 h-10 w-px relative">
                   <div className={cn(
                     "absolute inset-0 transition-colors duration-300",
                     isCompleted ? "bg-muted-foreground" : "bg-border"
                   )} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-border">
         <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-background rounded border border-border">
               <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Compute Load</div>
               <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: isProcessing ? '75%' : '2%' }} />
               </div>
            </div>
            <div className="p-3 bg-background rounded border border-border">
               <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Queue Sync</div>
               <div className="text-xs font-mono text-foreground">{isProcessing ? 'REALTIME' : 'STABLE'}</div>
            </div>
         </div>
      </div>
    </div>
  );
}