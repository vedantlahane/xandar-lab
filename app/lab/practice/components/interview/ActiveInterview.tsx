// app/lab/practice/components/interview/ActiveInterview.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Lightbulb,
  Clock,
  X,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InterviewConfig } from "./InterviewManager";

// TODO: Replace all mock AI responses with real API calls:
// POST /api/interviews/message — send user message, receive AI response
// POST /api/interviews/hint — request a hint, receive AI hint
// POST /api/interviews/end — end session, receive report data

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

interface ActiveInterviewProps {
  config: InterviewConfig;
  onEnd: () => void;
}

export function ActiveInterview({ config, onEnd }: ActiveInterviewProps) {
  const [phase, setPhase] = useState("Understanding");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Good. You're given an array of meeting intervals [start, end]. Find the minimum number of conference rooms required.\n\nBefore we jump to coding — can you think about what determines whether two meetings conflict?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const totalSeconds = 45 * 60;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const now = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // TODO: Replace with POST /api/interviews/message
  const mockAIResponse = (userText: string) => {
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Good intuition. What approach would give you that maximum overlap?",
          timestamp: now(),
        },
      ]);
    }, 1000);
  };

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        text: inputMessage,
        timestamp: now(),
      },
    ]);

    const sent = inputMessage;
    setInputMessage("");
    mockAIResponse(sent);
  };

  const handleHint = () => {
    if (hintsUsed >= 3) return;
    setHintsUsed((h) => h + 1);

    // TODO: Replace with POST /api/interviews/hint
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        text: "[Requested a hint]",
        timestamp: now(),
      },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Hint: Think about what happens if you sort the intervals by start time and use a min-heap to track end times.",
          timestamp: now(),
        },
      ]);
    }, 800);
  };

  const handleClarify = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        text: "Can you clarify the problem?",
        timestamp: now(),
      },
    ]);

    // TODO: Replace with POST /api/interviews/message with clarify flag
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Sure — you're given a list of intervals where each interval represents [start_time, end_time] of a meeting. Two meetings conflict if they overlap in time. You need to find the minimum number of rooms so that no two overlapping meetings share a room.",
          timestamp: now(),
        },
      ]);
    }, 800);
  };

  const handleEnd = () => {
    setIsRunning(false);
    onEnd();
  };

  return (
    <div className="h-full flex flex-col pt-6 pb-6 px-12 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div>
          <h2 className="text-sm font-semibold">
            {config.style} Style · {config.difficulty}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Phase: {phase}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatTime(elapsedSeconds)} / {formatTime(totalSeconds)}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEnd}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-2"
          >
            End <X className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto py-8 space-y-8 thin-scrollbar relative px-4">
        {messages.map((msg, i) => (
          <div key={msg.id} className="relative group">
            {msg.sender === "ai" ? (
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🤖</span>
                    <span className="font-semibold text-sm">Interviewer</span>
                  </div>
                  <div className="text-foreground text-sm leading-relaxed whitespace-pre-wrap pl-8">
                    {msg.text}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1 pl-8">
                    <span className="font-semibold text-sm">You</span>
                    <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {msg.timestamp}
                    </span>
                  </div>
                  <div className="text-foreground text-sm leading-relaxed whitespace-pre-wrap pl-8">
                    {msg.text}
                  </div>
                </div>
              </div>
            )}
            {i < messages.length - 1 && (
              <div className="absolute -bottom-5 left-8 right-0 h-px border-b border-dashed border-border/20" />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pt-4 border-t border-border/40 pb-20">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your response..."
            className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50 shadow-sm"
          />
          <Button onClick={handleSend} className="px-6">
            Send
          </Button>
          <Button
            variant="outline"
            className="gap-2 shrink-0"
            onClick={handleHint}
            disabled={hintsUsed >= 3}
            title={hintsUsed >= 3 ? "No hints remaining" : "Request a hint"}
          >
            <Lightbulb className="h-4 w-4" /> Hint ({hintsUsed}/3)
          </Button>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 text-muted-foreground"
            onClick={handleClarify}
          >
            Ask to clarify
          </Button>
          {phase === "Understanding" ? (
            <Button
              variant="secondary"
              size="sm"
              className="text-xs h-8"
              onClick={() => setPhase("Approach")}
            >
              I understand, let&apos;s discuss approach{" "}
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          ) : phase === "Approach" ? (
            <Button
              variant="secondary"
              size="sm"
              className="text-xs h-8"
              onClick={() => setPhase("Code")}
            >
              Ready to code <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          ) : phase === "Code" ? (
            <Button
              variant="secondary"
              size="sm"
              className="text-xs h-8"
              onClick={() => setPhase("Review")}
            >
              I submitted on LeetCode <Check className="h-3 w-3 ml-1" />
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="text-xs h-8"
              onClick={handleEnd}
            >
              End Interview
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}