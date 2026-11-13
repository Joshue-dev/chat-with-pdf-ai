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

export function WelcomeMessage({
  onAsk,
}: {
  onAsk: (question: string) => void;
}) {
  const intro = [
    "Hello, I am a multilingual document assistant here to help you with any questions you may have about the document you have uploaded.",
    "The document is a proposal by Stephen Jude for the GOAT Token, which involves a UI/UX redesign for the landing page. The goal is to create a visually appealing and user-centric interface that aligns with the brand's identity and values.",
  ];
  const suggestions = [
    "What is Stephen Jude's approach to developing digital solutions?",
    "What are the key components of the product design strategy for the GOAT Token proposal?",
    "How does the proposal aim to ensure accessibility and responsiveness across various devices?",
  ];
  const closing = "Please feel free to ask me a question about the document!";

  return (
    <article className="flex items-start gap-5 sm:gap-7" aria-label="Assistant introduction">
      <AssistantAvatar />
      <div className="min-w-0 flex-1 pt-1.5">
        <span className="sr-only">Assistant</span>
        <div className="space-y-4 text-[15px] leading-6 text-[#1a1a1c]">
          {intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <MessageActions text={intro.join("\n\n")} />
        <div className="mt-6 text-[15px] leading-6 text-[#1a1a1c]">
          <p>Possible questions you can ask:</p>
          <div className="mt-1 flex flex-col items-start gap-1">
            {suggestions.map((question, index) => (
              <button
                key={question}
                type="button"
                className="cursor-pointer rounded-sm text-left text-[#1a1a1c] underline decoration-[#1a1a1c] underline-offset-[3px] hover:text-[#5314a1] hover:decoration-[#5314a1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5314a1]/35 active:text-[#3b0d78]"
                onClick={() => onAsk(question)}
              >
                {index + 1}. {question}
              </button>
            ))}
          </div>
          <p className="mt-5">{closing}</p>
        </div>
        <MessageActions text={[...suggestions.map((question, index) => `${index + 1}. ${question}`), closing].join("\n")} />
      </div>
    </article>
  );
}

function Citation({ value }: { value: string }) {
  return (
    <span className="ml-1 inline-flex size-4 translate-y-[-1px] items-center justify-center rounded-full bg-black align-middle text-[10px] font-medium leading-none text-white">
      {value}
    </span>
  );
}

export function ChatMessage({ message }: { message: ConversationMessage }) {
  if (message.role === "user") {
    return (
      <article className="flex items-center gap-5 sm:gap-7" aria-label="Your message">
        <UserAvatar />
        <div className="min-w-0">
          <span className="sr-only">You</span>
          <div className="w-fit max-w-full rounded-xl bg-[#f5f5f7] px-3.5 py-2.5 text-[15px] leading-6 whitespace-pre-wrap text-[#1a1a1c] sm:max-w-[380px]">
            {message.text}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex items-start gap-5 sm:gap-7" aria-label="Assistant message">
      <AssistantAvatar />
      <div className="min-w-0 flex-1 pt-1.5">
        <span className="sr-only">Assistant</span>
        {message.mocked && (
          <p className="mb-1.5 text-[12.5px] leading-5 font-medium text-[#5314a1]">
            Simulated reply · not generated by a connected AI service
          </p>
        )}
        <p className="text-[15px] leading-6 whitespace-pre-wrap text-[#1a1a1c]">
          {message.text}
          {message.citation ? <Citation value={message.citation} /> : null}
        </p>
        {message.feedback ? <MessageActions text={message.text} /> : null}
      </div>
    </article>
  );
}

export function TypingIndicator() {
  return (
    <article className="flex items-center gap-5 sm:gap-7" aria-label="Assistant is typing a simulated reply">
      <AssistantAvatar />
      <div className="flex items-center gap-1.5 pt-1" aria-hidden="true">
        <span className="size-1.5 animate-bounce rounded-full bg-[#b0b0b6] [animation-delay:-0.3s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-[#b0b0b6] [animation-delay:-0.15s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-[#b0b0b6]" />
      </div>
    </article>
  );
}
