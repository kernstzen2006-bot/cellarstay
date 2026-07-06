import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { 
  ArrowRight, MessageCircle, Send, CheckCircle2, 
  TrendingUp, Users, RefreshCw, ArrowLeft,
  Wifi, BatteryMedium, Signal, CheckCheck, Check
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/demo")({
  validateSearch: z.object({
    venue: z.string().optional(),
  }),
  component: DemoPage,
});

type ChatMessage = {
  id: string;
  sender: "guest" | "ai";
  text: React.ReactNode;
  time: string;
  isRead?: boolean;
};

function analyzeEnquiry(text: string, venueName: string): string[] {
  const clean = text.trim().toLowerCase();
  
  if (clean.length < 4 || /^[\s\W]+$/.test(clean)) {
    return [
      `Hi there! 👋 I didn't quite catch that.`,
      `Are you looking to make a booking at ${venueName}, or did you have a question about our offerings?`
    ];
  }

  const isPet = /pet|dog|cat|puppy/i.test(clean);
  const isWine = /bring (our|my) own wine|corkage/i.test(clean);
  const headcountMatch = text.match(/\b(\d+)\s*(people|pax|guests|of us)?\b/i);
  const headcount = headcountMatch ? headcountMatch[1] : null;

  const response: string[] = [];
  response.push(`Hi there! 👋 Thanks for reaching out to ${venueName}.`);
  
  let details = `Yes, we have availability for that date.`;
  if (headcount) {
    details = `Yes, we definitely have space for ${headcount} this Saturday.`;
  }
  
  details += ` Our standard tasting is R150 per person, and we also have a beautiful cheese platter available for R220.`;
  response.push(details);

  if (isPet) {
    response.push(`And yes, we are absolutely pet-friendly! We'd love to welcome your furry friend. 🐕`);
  } else if (isWine) {
    response.push(`Regarding wine, we do allow you to bring your own special bottle! Corkage is R80 per bottle.`);
  }

  response.push(`Would you like me to send you a secure link to confirm the booking and pay the deposit?`);

  return response;
}

function parseBookingDetails(message: string) {
  const normalized = message.toLowerCase();
  const guestMatch = normalized.match(/\b(\d+)\s*(guest|guests|people|pax|persons?)\b/i);
  const cheeseMatch = normalized.match(/\b(\d+)\s*(cheese\s+platters?|platters?)\b/i);
  const hasCheeseMention = normalized.includes("cheese");

  const guestCount = guestMatch ? Number.parseInt(guestMatch[1], 10) : null;
  const cheesePlatterCount = cheeseMatch
    ? Number.parseInt(cheeseMatch[1], 10)
    : hasCheeseMention
      ? 1
      : 0;

  const extrasText = cheesePlatterCount > 0
    ? `${cheesePlatterCount} cheese platter${cheesePlatterCount > 1 ? "s" : ""}`
    : "";

  return {
    guestCount,
    extrasText,
    cheesePlatterCount,
  };
}

function CountUp({ end, prefix = "", suffix = "", decimals = 0 }: { end: number, prefix?: string, suffix?: string, decimals?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1500;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(ease * end);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [end]);

  const formatted = count.toLocaleString('en-US', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  });

  return <span>{prefix}{formatted}{suffix}</span>;
}

function DemoPage() {
  const { venue } = Route.useSearch();
  const defaultVenue = venue || "Val de Vie Estate";
  const [venueName, setVenueName] = useState(defaultVenue);
  
  const [stage, setStage] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [customMsg, setCustomMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [aiRepliedFully, setAiRepliedFully] = useState(false);
  const [awaitingPaymentReply, setAwaitingPaymentReply] = useState(false);
  const [paymentLinkSent, setPaymentLinkSent] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [paymentStep, setPaymentStep] = useState<"intro" | "guests" | "extras" | "done">("intro");
  const [guestCount, setGuestCount] = useState(0);
  const [extras, setExtras] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<number | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const runIdRef = useRef(0);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, stage]);

  const handleGuestSend = (msg: string) => {
    if (!msg.trim()) return;
    const currentRunId = ++runIdRef.current;
    
    const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    setMessages([{ id: Date.now().toString(), sender: "guest", text: msg, time: timeNow, isRead: false }]);
    setCustomMsg("");
    setReplyInput("");
    setStage(2);
    setAiRepliedFully(false);
    setAwaitingPaymentReply(false);
    setPaymentLinkSent(false);
    setPaymentStep("intro");
    setGuestCount(0);
    setExtras("");
    
    setTimeout(() => {
      if (runIdRef.current !== currentRunId) return;
      setMessages(prev => prev.map(m => m.sender === "guest" ? { ...m, isRead: true } : m));
      setIsTyping(true);
    }, 1000);

    const replies = analyzeEnquiry(msg, venueName);
    
    let delay = 1000 + 1500;
    replies.forEach((reply, index) => {
      setTimeout(() => {
        if (runIdRef.current !== currentRunId) return;
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now().toString() + index,
          sender: "ai",
          text: reply,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        }]);
        
        if (index < replies.length - 1) {
          setTimeout(() => {
            if (runIdRef.current !== currentRunId) return;
            setIsTyping(true);
          }, 400);
        } else {
          setTimeout(() => {
            if (runIdRef.current !== currentRunId) return;
            setAiRepliedFully(true);
            setAwaitingPaymentReply(true);
          }, 500);
        }
      }, delay);
      
      delay += 400 + 1500 + (reply.length * 15);
    });
  };

  const getPaymentTotal = (guestCountValue: number, extrasText: string) => {
    const basePerGuest = 150;
    const baseDeposit = 300;
    const guestCharge = Math.max(guestCountValue, 0) * basePerGuest;
    const cheeseMatch = extrasText.toLowerCase().match(/(\d+)\s*cheese\s*platters?/i);
    const cheesePlatterCount = cheeseMatch ? Number.parseInt(cheeseMatch[1], 10) : extrasText.toLowerCase().includes("cheese") ? 1 : 0;
    const extrasCharge = cheesePlatterCount * 220;
    return baseDeposit + guestCharge + extrasCharge;
  };

  const handlePaymentReply = (msg: string) => {
    if (!msg.trim()) return;

    const currentRunId = ++runIdRef.current;
    const timeNow = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

    setMessages((prev) => [...prev, { id: `${Date.now()}-reply`, sender: "guest", text: msg, time: timeNow, isRead: false }]);
    setReplyInput("");
    setAwaitingPaymentReply(false);
    setIsTyping(true);

    setTimeout(() => {
      if (runIdRef.current !== currentRunId) return;
      setIsTyping(false);

      const parsed = parseBookingDetails(msg);
      const nextGuestCount = parsed.guestCount ?? guestCount;
      const nextExtras = parsed.extrasText || extras;

      if (parsed.guestCount && parsed.extrasText) {
        setGuestCount(parsed.guestCount);
        setExtras(parsed.extrasText);
        const total = getPaymentTotal(parsed.guestCount, parsed.extrasText);
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-payment-link`,
            sender: "ai",
            text: (
              <div className="space-y-2">
                <div>Perfect — your final deposit comes to <strong>R{total}</strong> for {parsed.guestCount} guests plus {parsed.extrasText}.</div>
                <div>Here is your secure Yoco payment link to confirm the booking and pay the deposit.</div>
                <a
                  href="https://pay.yoco.com/demo/booking-1942"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center font-semibold text-[#075E54] underline underline-offset-2"
                >
                  Pay deposit securely
                </a>
              </div>
            ),
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
          },
        ]);
        setPaymentStep("done");
        setPaymentLinkSent(true);
        return;
      }

      if (parsed.guestCount) {
        setGuestCount(parsed.guestCount);
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-payment-extras`,
            sender: "ai",
            text: "Great — anything else to add, such as a cheese platter or a special request?",
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
          },
        ]);
        setPaymentStep("extras");
        return;
      }

      if (parsed.extrasText) {
        setExtras(parsed.extrasText);
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-payment-guests`,
            sender: "ai",
            text: "Thanks — I’ve picked up the extra request. What is the final number of guests?",
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
          },
        ]);
        setPaymentStep("guests");
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-payment-question`,
          sender: "ai",
          text: "Perfect — before I send the secure link, I just need the exact final number of guests and anything else you'd like to add.",
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        },
      ]);
      setPaymentStep("guests");
    }, 1200);
  };

  const resetDemo = () => {
    setIsResetting(true);
    runIdRef.current++;
    setTimeout(() => {
      setStage(1);
      setMessages([]);
      setCustomMsg("");
      setReplyInput("");
      setIsTyping(false);
      setAiRepliedFully(false);
      setAwaitingPaymentReply(false);
      setPaymentLinkSent(false);
      setPaymentStep("intro");
      setGuestCount(0);
      setExtras("");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsResetting(false);
    }, 600);
  };

  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative">
      {isResetting && (
        <div className="fixed inset-0 z-[100] bg-[color:var(--cream)]/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="animate-spin text-[color:var(--gold)]" size={28} />
            <div className="font-medium text-[color:var(--ink)]">Resetting demo...</div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[color:var(--cream)]/85 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 md:px-8">
          <a href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-[color:var(--ink)] transition">
            <ArrowLeft size={16} /> Back to site
          </a>
          <div className="text-xs uppercase tracking-widest text-[color:var(--gold)] font-medium">Interactive Demo</div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-[color:var(--ink)] text-[color:var(--cream)] py-6 px-5 relative z-10">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-medium">
            <StageTab active={stage >= 1} num={1} label="Guest Enquiry" />
            <div className={`hidden sm:block h-px flex-1 transition-colors duration-500 ${stage >= 2 ? "bg-[color:var(--gold)]" : "bg-[color:var(--cream)]/20"}`} />
            <StageTab active={stage >= 2} num={2} label="AI Concierge" />
            <div className={`hidden sm:block h-px flex-1 transition-colors duration-500 ${stage >= 3 ? "bg-[color:var(--gold)]" : "bg-[color:var(--cream)]/20"}`} />
            <StageTab active={stage >= 3} num={3} label="Confirmed" />
            <div className={`hidden sm:block h-px flex-1 transition-colors duration-500 ${stage >= 4 ? "bg-[color:var(--gold)]" : "bg-[color:var(--cream)]/20"}`} />
            <StageTab active={stage >= 4} num={4} label="Owner View" />
          </div>
        </div>
      </div>

      <main className="flex-1 px-5 py-12 md:py-16 mx-auto w-full max-w-5xl overflow-hidden">
        {/* Venue Name Configurator */}
        {stage < 4 && (
          <div className="mb-10 max-w-md mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-20">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Personalise this demo for:
            </label>
            <input 
              type="text" 
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              className="w-full bg-transparent border-b-2 border-border border-t-0 border-x-0 px-0 py-2 text-center font-display text-2xl md:text-3xl text-[color:var(--ink)] focus:ring-0 focus:border-[color:var(--gold)] outline-none transition-colors"
            />
          </div>
        )}

        <div className="flex flex-col items-center">
          {/* Phone Frame for Stages 1-3 */}
          {stage < 4 ? (
            <div className="relative w-full max-w-[380px] h-[700px] md:h-[720px] rounded-[3rem] border-[12px] border-[color:var(--ink)] bg-[#EFEAE2] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-500">
              {/* Fake Phone Status Bar */}
              <div className="bg-[#075E54] text-white px-6 py-2.5 text-[12px] flex justify-between items-center font-semibold">
                <span>{currentTime}</span>
                <div className="flex gap-1.5 items-center opacity-90">
                  <Signal size={14} strokeWidth={2.5} />
                  <Wifi size={14} strokeWidth={2.5} />
                  <BatteryMedium size={16} strokeWidth={2.5} />
                </div>
              </div>
              
              {/* WhatsApp Header */}
              <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3 shadow-sm z-10 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <span className="font-display text-lg">{venueName.charAt(0)}</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-semibold truncate text-[15px]">{venueName}</div>
                  <div className="text-[12px] text-white/90">typically replies instantly</div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 min-h-0 p-4 overflow-y-auto flex flex-col gap-3 bg-[#E5DDD5] pb-6">
                {/* Intro Date */}
                <div className="flex justify-center mb-2">
                  <span className="bg-[#E1F3FB] text-gray-600 text-[11px] px-3 py-1 rounded-lg uppercase tracking-wider font-medium shadow-sm">Today</span>
                </div>

                {/* Stages 1-2 Messages */}
                {messages.map((m) => (
                  <div 
                    key={m.id} 
                    className={cn(
                      "max-w-[85%] rounded-lg p-2.5 shadow-sm text-[15px] text-[#303030] animate-in fade-in slide-in-from-bottom-2 duration-300 relative",
                      m.sender === "guest" 
                        ? "self-end bg-[#E7FFDB] rounded-tr-none" 
                        : "self-start bg-white rounded-tl-none"
                    )}
                  >
                    <div className="pb-3">{m.text}</div>
                    <div className="absolute right-2 bottom-1 flex items-center gap-1 text-[10px] text-gray-500">
                      {m.time}
                      {m.sender === "guest" && (
                        m.isRead ? <CheckCheck size={14} className="text-blue-500" /> : <Check size={14} />
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="self-start max-w-[85%] bg-white rounded-lg rounded-tl-none p-4 shadow-sm text-gray-500 text-sm flex items-center gap-1 w-16 h-[38px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                )}

                {/* Stage 3: Confirmation Card */}
                {stage >= 3 && (
                  <div className="self-start w-full max-w-[90%] bg-white rounded-lg rounded-tl-none p-3 shadow-sm text-[14px] text-[#303030] border-l-4 border-[#075E54] animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-500">
                    <div className="font-semibold mb-2 flex items-center gap-1.5">
                      <CheckCircle2 size={18} className="text-[#075E54]" /> Booking Confirmed!
                    </div>
                    <div className="ticket ticket-notch p-3 border border-border rounded mt-2 bg-[color:var(--cream)] relative overflow-hidden animate-in zoom-in-105 duration-700 delay-150">
                      <div className="text-xs uppercase tracking-wider text-[color:var(--gold)] font-semibold">Ref: #SAT-1942</div>
                      <div className="mt-1 font-medium">{venueName}</div>
                      <div className="perforated my-2" />
                      <div className="text-xs text-muted-foreground flex justify-between items-center gap-2">
                        <span>Deposit Paid</span>
                        <span className="font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                          R{(guestCount || 0) * 150 + 300 + ((extras.toLowerCase().includes("cheese") ? 220 : 0))}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-gray-600">A reminder is scheduled for 48 hours before arrival. See you soon!</p>
                  </div>
                )}
                
                <div ref={chatEndRef} className="h-28" />
              </div>

              {/* Chat Input Area Stage 1 */}
              {stage === 1 && messages.length === 0 && (
                <div className="bg-[#f0f0f0] p-3 flex flex-col gap-2 relative z-10 border-t border-gray-200">
                  <div className="text-[11px] text-center text-muted-foreground mb-1 font-medium">Select an example or type your own:</div>
                  <div className="flex gap-2">
                    <button onClick={() => handleGuestSend("hey guys do yall have space sat for 12")} className="flex-1 bg-white border border-gray-300 rounded-full px-3 py-1.5 text-[13px] text-left text-gray-700 hover:bg-gray-50 transition truncate shadow-sm">
                      "hey guys do yall have space sat for 12"
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleGuestSend("is it pet friendly we have a small dog")} className="flex-1 bg-white border border-gray-300 rounded-full px-3 py-1.5 text-[13px] text-left text-gray-700 hover:bg-gray-50 transition truncate shadow-sm">
                      "is it pet friendly we have a small dog"
                    </button>
                  </div>
                  <div className="flex gap-2 items-center bg-white rounded-full pl-4 pr-1.5 py-1.5 mt-1 shadow-sm border border-gray-200">
                    <input 
                      type="text" 
                      placeholder="Type a custom message..." 
                      className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-gray-400"
                      value={customMsg}
                      onChange={(e) => setCustomMsg(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGuestSend(customMsg)}
                    />
                    <button 
                      onClick={() => handleGuestSend(customMsg)}
                      className={`bg-[#075E54] text-white p-1.5 rounded-full ${customMsg.trim() ? "opacity-100 scale-100" : "opacity-50 scale-90"} transition-all duration-200`}
                    >
                      <Send size={16} className="-ml-0.5" />
                    </button>
                  </div>
                </div>
              )}

              {stage === 2 && aiRepliedFully && !paymentLinkSent && (
                <div className="border-t border-gray-200 bg-[#f7f4ee] p-3">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {paymentStep === "guests" && "Enter the final guest count"}
                    {paymentStep === "extras" && "Add anything else needed"}
                    {paymentStep === "intro" && "Reply to send the secure deposit link"}
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm">
                    <input
                      type="text"
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handlePaymentReply(replyInput)}
                      placeholder={paymentStep === "guests" ? "e.g. 8" : paymentStep === "extras" ? "e.g. cheese platter" : "Yes please"}
                      className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-gray-400"
                      disabled={isTyping}
                    />
                    <button
                      onClick={() => handlePaymentReply(replyInput)}
                      disabled={isTyping || !replyInput.trim()}
                      className="rounded-full bg-[#075E54] p-2 text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Interstitial Controls Stage 2 */}
              {stage === 2 && paymentLinkSent && (
                <div className="border-t border-gray-200 bg-white/95 p-4 shadow-[0_-8px_20px_rgba(0,0,0,0.06)]">
                  <div className="bg-[color:var(--gold)]/10 text-[color:var(--ink)] p-3 rounded-lg text-sm mb-3 border border-[color:var(--gold)]/30">
                    <span className="font-semibold flex items-center gap-1.5 mb-1 text-[color:var(--gold)]"><CheckCircle2 size={16}/> Secure payment link sent</span>
                    The guest can now pay the deposit and confirm the booking.
                  </div>
                  <button 
                    onClick={() => setStage(3)}
                    className="w-full bg-[#075E54] text-white rounded-full py-3.5 font-medium flex items-center justify-center gap-2 transition hover:bg-[#064c44] shadow-md hover:shadow-lg"
                  >
                    Guest pays & confirms <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {/* Interstitial Controls Stage 3 */}
              {stage === 3 && (
                <div className="border-t border-gray-200 bg-white/95 p-4 shadow-[0_-8px_20px_rgba(0,0,0,0.06)]">
                   <button 
                    onClick={() => setStage(4)}
                    className="w-full bg-[color:var(--ink)] text-[color:var(--cream)] rounded-full py-3.5 font-medium flex items-center justify-center gap-2 transition hover:bg-black shadow-md hover:shadow-lg"
                  >
                    See Owner Dashboard <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Stage 4: Owner Dashboard
            <div className="w-full max-w-4xl animate-in fade-in slide-in-from-right-8 duration-500 ease-out">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                    <h2 className="font-display text-3xl text-[color:var(--ink)]">Owner Dashboard</h2>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                      {venueName} Overview
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={resetDemo} className="px-4 py-2 text-sm font-medium border border-border rounded-md bg-white hover:bg-accent transition flex items-center gap-2 text-[color:var(--ink)] shadow-sm">
                      <RefreshCw size={16} /> Restart Demo
                    </button>
                    <div className="text-[11px] text-muted-foreground font-medium">Last synced: 2 minutes ago</div>
                  </div>
               </div>

               {/* Stat row */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                  <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
                    <div className="flex justify-between items-start relative z-10">
                      <div className="text-sm font-medium text-muted-foreground">Enquiries This Week</div>
                      <MessageCircle size={18} className="text-[color:var(--gold)]" />
                    </div>
                    <div className="mt-3 text-4xl font-display text-[color:var(--ink)] relative z-10">
                      <CountUp end={42} />
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-green-700 font-medium bg-green-50/80 px-2.5 py-1 rounded-md inline-flex border border-green-100 relative z-10">
                      <TrendingUp size={14} /> +18% vs last week
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
                    <div className="flex justify-between items-start relative z-10">
                      <div className="text-sm font-medium text-muted-foreground">Conversion Rate</div>
                      <TrendingUp size={18} className="text-[color:var(--gold)]" />
                    </div>
                    <div className="mt-3 text-4xl font-display text-[color:var(--ink)] relative z-10">
                      <CountUp end={68} suffix="%" />
                    </div>
                    <div className="mt-3 text-xs text-green-700 font-medium bg-green-50/80 px-2.5 py-1 rounded-md inline-flex border border-green-100 relative z-10">
                      Automated replies active
                    </div>
                  </div>
                  <div className="bg-[color:var(--ink)] text-[color:var(--cream)] rounded-xl p-6 shadow-xl border border-[color:var(--ink)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[color:var(--gold)]/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl" />
                    <div className="flex justify-between items-start relative z-10">
                      <div className="text-sm font-medium text-[color:var(--cream)]/80">Recovered Revenue</div>
                      <CheckCircle2 size={18} className="text-[color:var(--gold)]" />
                    </div>
                    <div className="mt-3 text-4xl font-display text-[color:var(--gold)] relative z-10">
                      <CountUp end={12450} prefix="R" />
                    </div>
                    <div className="mt-3 text-xs text-[color:var(--cream)]/90 relative z-10 leading-relaxed">
                      <strong className="text-[color:var(--gold)]">3 enquiries saved</strong> this week that would have gone unanswered.
                    </div>
                  </div>
               </div>

               {/* Bookings List */}
               <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mb-12">
                  <div className="px-6 py-4 border-b border-border bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-semibold text-[color:var(--ink)]">Recent Inbox Activity</h3>
                    <button className="text-xs text-[color:var(--gold)] font-medium hover:underline">View All</button>
                  </div>
                  <div className="grid gap-4 p-4 lg:grid-cols-[1.4fr_0.8fr]">
                    <div className="divide-y divide-border rounded-xl border border-border overflow-hidden bg-white">
                      <button
                        onClick={() => setSelectedEnquiry(0)}
                        className={`w-full p-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left transition-colors ${selectedEnquiry === 0 ? "bg-[color:var(--gold)]/10" : "hover:bg-gray-50/70"}`}
                      >
                        <div className="flex gap-4 items-center">
                          <div className="w-10 h-10 rounded-full bg-[color:var(--ink)] text-[color:var(--gold)] flex items-center justify-center shrink-0 shadow-md">
                            <CheckCircle2 size={20} />
                          </div>
                          <div>
                            <div className="font-medium text-[color:var(--ink)] flex items-center gap-2">
                              {messages.length > 0 ? "New Guest Enquiry" : "Guest Enquiry"}
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[color:var(--gold)] text-[color:var(--ink)] uppercase tracking-wider shadow-sm">Just Now</span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-0.5 max-w-sm truncate">
                              {messages.length > 0 ? messages[0].text : "Wine Tasting for 4"}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto">
                          <div className="text-sm font-medium">Sat 14:00</div>
                          <div className="text-xs font-semibold text-green-700 bg-green-100 border border-green-200 px-2.5 py-0.5 rounded-full inline-flex max-w-fit shadow-sm">Deposit Paid</div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => setSelectedEnquiry(1)}
                        className={`w-full p-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left transition-colors ${selectedEnquiry === 1 ? "bg-[color:var(--gold)]/10" : "hover:bg-gray-50/70"}`}
                      >
                        <div className="flex gap-4 items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 border border-gray-200">
                            <span className="font-display font-medium text-gray-600 text-lg">J</span>
                          </div>
                          <div>
                            <div className="font-medium text-[color:var(--ink)]">Johan & Marie</div>
                            <div className="text-sm text-muted-foreground mt-0.5">Wine tasting — 12 guests</div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto">
                          <div className="text-sm font-medium text-gray-500">Yesterday, 18:30</div>
                          <div className="text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 px-2.5 py-0.5 rounded-full inline-flex max-w-fit">Confirmed</div>
                        </div>
                      </button>

                      <button
                        onClick={() => setSelectedEnquiry(2)}
                        className={`w-full p-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left transition-colors ${selectedEnquiry === 2 ? "bg-[color:var(--gold)]/10" : "hover:bg-gray-50/70"}`}
                      >
                        <div className="flex gap-4 items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 border border-gray-200">
                            <span className="font-display font-medium text-gray-600 text-lg">P</span>
                          </div>
                          <div>
                            <div className="font-medium text-[color:var(--ink)]">Peter V.</div>
                            <div className="text-sm text-muted-foreground mt-0.5">Private event enquiry — 40 pax</div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto">
                          <div className="text-sm font-medium text-gray-500">Yesterday, 14:15</div>
                          <div className="text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full inline-flex max-w-fit">Awaiting deposit</div>
                        </div>
                      </button>

                      <button
                        onClick={() => setSelectedEnquiry(3)}
                        className={`w-full p-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left transition-colors ${selectedEnquiry === 3 ? "bg-[color:var(--gold)]/10" : "hover:bg-gray-50/70"}`}
                      >
                        <div className="flex gap-4 items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 border border-gray-200">
                            <span className="font-display font-medium text-gray-600 text-lg">L</span>
                          </div>
                          <div>
                            <div className="font-medium text-[color:var(--ink)]">Liam</div>
                            <div className="text-sm text-muted-foreground mt-0.5">Quick question about menu</div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto">
                          <div className="text-sm font-medium text-gray-500">Tue, 09:40</div>
                          <div className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full inline-flex max-w-fit">Enquiry only</div>
                        </div>
                      </button>
                    </div>

                    <div className="rounded-xl border border-border bg-[color:var(--cream)] p-5 shadow-sm">
                      {selectedEnquiry === null ? (
                        <div className="text-sm text-muted-foreground">Select an enquiry to view the full details here.</div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="font-semibold text-[color:var(--ink)]">
                                {selectedEnquiry === 0 && (messages.length > 0 ? "New Guest Enquiry" : "Guest Enquiry")}
                                {selectedEnquiry === 1 && "Johan & Marie"}
                                {selectedEnquiry === 2 && "Peter V."}
                                {selectedEnquiry === 3 && "Liam"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {selectedEnquiry === 0 && "Booking enquiry received from the guest chat"}
                                {selectedEnquiry === 1 && "Weekend tasting reservation request"}
                                {selectedEnquiry === 2 && "Large private event booking request"}
                                {selectedEnquiry === 3 && "Menu question before booking"}
                              </div>
                            </div>
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[color:var(--ink)] border border-border">
                              {selectedEnquiry === 0 ? "Deposit Paid" : selectedEnquiry === 1 ? "Confirmed" : selectedEnquiry === 2 ? "Awaiting deposit" : "Enquiry only"}
                            </span>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-lg border border-border bg-white p-3">
                              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Guest count</div>
                              <div className="mt-1 font-semibold text-[color:var(--ink)]">
                                {selectedEnquiry === 0 ? `${guestCount || 4} guests` : selectedEnquiry === 1 ? "12 guests" : selectedEnquiry === 2 ? "40 pax" : "2 guests"}
                              </div>
                            </div>
                            <div className="rounded-lg border border-border bg-white p-3">
                              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Deposit</div>
                              <div className="mt-1 font-semibold text-[color:var(--ink)]">
                                {selectedEnquiry === 0 ? `R${(guestCount || 4) * 150 + 300 + (extras.toLowerCase().includes("cheese") ? 220 : 0)}` : selectedEnquiry === 1 ? "R1800" : selectedEnquiry === 2 ? "R6000" : "R0"}
                              </div>
                            </div>
                            <div className="rounded-lg border border-border bg-white p-3">
                              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Requested extras</div>
                              <div className="mt-1 text-sm text-[color:var(--ink)]">
                                {selectedEnquiry === 0 ? (extras ? extras : "None") : selectedEnquiry === 1 ? "Vegetarian pairings" : selectedEnquiry === 2 ? "Private tasting room" : "None"}
                              </div>
                            </div>
                            <div className="rounded-lg border border-border bg-white p-3">
                              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Next action</div>
                              <div className="mt-1 text-sm text-[color:var(--ink)]">
                                {selectedEnquiry === 0 ? "Follow up on payment confirmation" : selectedEnquiry === 1 ? "Send final itinerary" : selectedEnquiry === 2 ? "Confirm availability and deposit" : "Answer menu question"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
               </div>

               <div className="text-center max-w-2xl mx-auto ticket ticket-notch p-10 bg-[color:var(--cream)] shadow-sm">
                 <h3 className="font-display text-3xl text-[color:var(--ink)] mb-4">Stop losing bookings to a missed WhatsApp.</h3>
                 <p className="text-[color:var(--ink)]/80 mb-8 text-lg">This entire flow runs automatically, turning enquiries into paid bookings while you sleep.</p>
                 <a
                    href="/#contact"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[color:var(--ink)] px-8 py-4 text-lg font-semibold text-[color:var(--cream)] transition hover:bg-[color:var(--gold)] hover:text-[color:var(--ink)] shadow-xl hover:-translate-y-0.5"
                  >
                    Get Your Free Booking Leak Audit <ArrowRight size={18} />
                  </a>
               </div>
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
           <p className="text-xs text-muted-foreground bg-[color:var(--cream)] inline-block px-4 py-2 rounded-full border border-border shadow-sm">
             This is a simulated demo — no real data or payments are involved.
           </p>
        </div>
      </main>
    </div>
  );
}

function StageTab({ active, num, label }: { active: boolean, num: number, label: string }) {
  return (
    <div className={`flex items-center gap-2.5 transition-all duration-500 ${active ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${active ? "bg-[color:var(--gold)] text-[color:var(--ink)] shadow-md scale-110" : "border border-[color:var(--cream)] text-[color:var(--cream)] scale-100"}`}>
        {num}
      </div>
      <span className={`font-medium ${active ? "text-[color:var(--gold)]" : ""}`}>{label}</span>
    </div>
  );
}
