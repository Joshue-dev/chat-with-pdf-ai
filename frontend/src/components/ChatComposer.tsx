import { useEffect, useRef, type KeyboardEvent } from "react";

type ChatComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
};

export function ChatComposer({ value, onChange, onSend }: ChatComposerProps) {
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0;

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    field.style.height = "auto";
    field.style.height = `${Math.min(field.scrollHeight, 144)}px`;
  }, [value]);

  function submit(event?: React.SyntheticEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!canSend) return;
    onSend();
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (!canSend) return;
    onSend();
  }

  return (
    <form
      id="composer"
      className="mx-4 mb-4 flex items-center gap-2 rounded-2xl border border-[#e4e4e7] bg-white px-3 py-2 transition focus-within:border-[#d0d0d4] focus-within:ring-2 focus-within:ring-black/5 sm:mx-6 md:mx-8 sm:mb-5"
      onSubmit={submit}
    >
      <button
        type="button"
        aria-label="Add attachment"
        className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-[#8a8a8c] transition hover:bg-[#f3f3f5] hover:text-[#1a1a1c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5314a1]/35 active:scale-95 active:bg-[#e8e8ec]"
        onClick={() => fieldRef.current?.focus()}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>
      <span className="h-5 w-px shrink-0 bg-[#d5d5d8]" aria-hidden="true" />
      <label htmlFor="chat-input" className="sr-only">
        Ask a question
      </label>
      <textarea
        id="chat-input"
        ref={fieldRef}
        rows={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Ask a question or Use @ to mention document"
        className="max-h-36 min-h-6 w-full flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-6 text-[#1a1a1c] placeholder:text-[#b0b0b4] focus:outline-none"
        aria-label="Ask a question"
        enterKeyHint="send"
      />
      <button
        type="submit"
        aria-label="Send message"
        aria-disabled={!canSend}
        className={`grid size-7 shrink-0 place-items-center rounded-full text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5314a1]/40 focus-visible:ring-offset-2 ${
          canSend
            ? "cursor-pointer bg-[#1c1c1e] hover:bg-black active:scale-95 active:bg-black"
            : "cursor-not-allowed bg-[#b7bac3]"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
