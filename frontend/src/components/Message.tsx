import { useState } from "react";

export type ConversationMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  citation?: string;
  mocked?: boolean;
  feedback?: boolean;
};

const actionButtonClass =
  "grid size-7 cursor-pointer place-items-center rounded-md text-[#8d8d92] transition hover:bg-[#ececef] hover:text-[#3a3a3e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5314a1]/35 active:bg-[#e2e2e6] active:text-[#1a1a1c]";

export function AssistantAvatar() {
  return (
    <span
      className="grid size-10 shrink-0 place-items-center rounded-full bg-black text-white"
      aria-hidden="true"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3.4 5.4A2.4 2.4 0 0 1 5.8 3h7.1a2.4 2.4 0 0 1 2.4 2.4v6.6a2.4 2.4 0 0 1-2.4 2.4H8.3l-2.7 2.3c-.5.42-1.25.06-1.25-.58v-1.72A2.4 2.4 0 0 1 3.4 12V5.4Z"
        />
        <path
          stroke="#111"
          strokeWidth="1.25"
          strokeLinecap="round"
          d="M6.15 6.7h5.5M6.15 8.85h5.5M6.15 11h3.5"
        />
        <path
          fill="currentColor"
          d="M15.1 6.1h2.35L16 9.15h2.55L14.4 15.1l1.05-3.7h-2.25L15.1 6.1Z"
        />
      </svg>
    </span>
  );
}

export function UserAvatar() {
  return (
    <span
      className="grid size-10 shrink-0 place-items-center rounded-full bg-[#5314a1] text-[16px] font-medium text-white"
      aria-hidden="true"
    >
      B
    </span>
  );
}

function IconCopy() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5 9.2 17 19 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconThumb({ down = false, filled = false }: { down?: boolean; filled?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      aria-hidden="true"
      className={down ? "rotate-180" : undefined}
    >
      <path
        d="M7 10v11H4.5A1.5 1.5 0 0 1 3 19.5v-8A1.5 1.5 0 0 1 4.5 10H7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7 10.2 11.2 3.8A2.2 2.2 0 0 1 14.8 5.4L14 9.2h4.15a1.8 1.8 0 0 1 1.76 2.16l-1.15 6.4A2.2 2.2 0 0 1 16.6 20H7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MessageActions({ text }: { text: string }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-2.5 flex items-center gap-1.5">
      <button
        type="button"
        className={actionButtonClass}
        aria-label={copied ? "Copied message" : "Copy message"}
        onClick={() => void copy()}
      >
        {copied ? <IconCheck /> : <IconCopy />}
      </button>
      <button
        type="button"
        className={`${actionButtonClass} ${vote === "up" ? "text-[#5314a1]" : ""}`}
        aria-label="Mark response as helpful"
        aria-pressed={vote === "up"}
        onClick={() => setVote((current) => (current === "up" ? null : "up"))}
      >
        <IconThumb filled={vote === "up"} />
      </button>
      <button
        type="button"
        className={`${actionButtonClass} ${vote === "down" ? "text-[#5314a1]" : ""}`}
        aria-label="Mark response as unhelpful"
        aria-pressed={vote === "down"}
        onClick={() => setVote((current) => (current === "down" ? null : "down"))}
      >
        <IconThumb down filled={vote === "down"} />
      </button>
    </div>
  );
}

export function EmptyStateMessage({
  suggestedQuestions,
  onAsk,
}: {
  suggestedQuestions: string[];
  onAsk: (question: string) => void;
}) {
  const intro = [
    "Hello! I'm your document assistant. Upload a document to get started, and I'll help you understand its contents.",
    "Once you upload a document, I can answer questions about it, provide summaries, and help you find specific information.",
  ];
  const closing = "Upload a document to begin!";

  return (
    <article className="flex items-start gap-4" aria-label="Assistant introduction">
      <AssistantAvatar />
      <div className="min-w-0 flex-1 pt-1.5 max-w-[85%]">
        <span className="sr-only">Assistant</span>
        <div className="space-y-4 text-[15px] leading-6 text-[#1a1a1c] dark:text-white">
          {intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <MessageActions text={intro.join("\n\n")} />
        {suggestedQuestions.length > 0 && (
          <div className="mt-6 text-[15px] leading-6 text-[#1a1a1c] dark:text-white">
            <p>Suggested questions:</p>
            <div className="mt-1 flex flex-col items-start gap-1">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={question}
                  type="button"
                  className="cursor-pointer rounded-sm text-left text-[#1a1a1c] dark:text-white underline decoration-[#1a1a1c] dark:decoration-white underline-offset-[3px] hover:text-[#5314a1] hover:decoration-[#5314a1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5314a1]/35 active:text-[#3b0d78]"
                  onClick={() => onAsk(question)}
                >
                  {index + 1}. {question}
                </button>
              ))}
            </div>
            <p className="mt-5">{closing}</p>
          </div>
        )}
        <MessageActions text={suggestedQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")} />
      </div>
    </article>
  );
}

function Citation({ value }: { value: string }) {
  return (
    <span className="ml-1 inline-flex size-4 -translate-y-px items-center justify-center rounded-full bg-black align-middle text-[10px] font-medium leading-none text-white">
      {value}
    </span>
  );
}

export function ChatMessage({ message }: { message: ConversationMessage }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <article className="flex items-end gap-3 justify-end" aria-label="Your message">
        <div className="min-w-0 max-w-[85%]">
          <div className="w-fit max-w-full rounded-2xl bg-[#5314a1] px-4 py-2.5 text-[15px] leading-6 whitespace-pre-wrap text-white">
            {message.text}
          </div>
        </div>
        <UserAvatar />
      </article>
    );
  }

  return (
    <article className="flex items-start gap-4" aria-label="Assistant message">
      <AssistantAvatar />
      <div className="min-w-0 flex-1 pt-1.5 max-w-[85%]">
        <span className="sr-only">Assistant</span>
        {message.mocked && (
          <p className="mb-1.5 text-[12.5px] leading-5 font-medium text-[#5314a1]">
            Simulated reply · not generated by a connected AI service
          </p>
        )}
        <div className="w-fit max-w-full rounded-2xl bg-[#f5f5f7] dark:bg-[#2a2a2e] px-4 py-2.5 text-[15px] leading-6 whitespace-pre-wrap text-[#1a1a1c] dark:text-white">
          {message.text}
          {message.citation ? <Citation value={message.citation} /> : null}
        </div>
        {message.feedback ? <MessageActions text={message.text} /> : null}
      </div>
    </article>
  );
}

export function TypingIndicator() {
  return (
    <article className="flex items-start gap-4" aria-label="Assistant is typing">
      <AssistantAvatar />
      <div className="min-w-0 max-w-[85%]">
        <div className="w-fit rounded-2xl bg-[#f5f5f7] dark:bg-[#2a2a2e] px-4 py-2.5">
          <div className="flex items-center gap-1.5 pt-1" aria-hidden="true">
            <span className="size-1.5 animate-bounce rounded-full bg-[#b0b0b6] [animation-delay:-0.3s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-[#b0b0b6] [animation-delay:-0.15s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-[#b0b0b6]" />
          </div>
        </div>
      </div>
    </article>
  );
}