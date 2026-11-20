import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { createPortal } from "react-dom";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onNewChat: () => void;
  hasActiveSession: boolean;
}

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      setTimeout(() => overlayRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = "";
      previousActiveElement.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusableElements = overlayRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const dialogContent = (
    <div
      ref={overlayRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#1e1e20] shadow-xl p-6 animate-slide-up">
        <h2 id="confirm-title" className="text-lg font-semibold text-[#1a1a1c] dark:text-white">
          {title}
        </h2>
        <p id="confirm-message" className="mt-2 text-[#535357] dark:text-[#b0b0b4]">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#5314a1] hover:bg-[#f3f0ff] dark:hover:bg-[#2a2a2e] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5314a1]/35"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-[#5314a1] hover:bg-[#3b0d78] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5314a1]/35"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}

export default function Header({ isDark, onToggleTheme, onNewChat, hasActiveSession }: HeaderProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleNewChatClick = () => {
    if (hasActiveSession) {
      setShowConfirm(true);
    } else {
      onNewChat();
    }
  };

  return (
    <>
      <header className="left-0 top-0 fixed w-full z-40 border-b border-[#e4e4e7] dark:border-[#3a3a3e] bg-white/80 dark:bg-[#141416]/80 backdrop-blur-md">
        <div className="flex *:items-center justify-between px-4 py-2">
          <div className="flex gap-4">
            <Icon icon="arcticons:document-scanner" className="text-[#5314a1]" aria-hidden="true" />
            <button
              onClick={handleNewChatClick}
              aria-label={hasActiveSession ? "Start new chat" : "Create new document"}
              className="grid cursor-pointer size-10 place-items-center rounded-lg text-[#8a8a8c] transition hover:bg-[#f3f3f5] hover:text-[#1a1a1c] dark:hover:bg-[#2a2a2e] dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5314a1]/35"
            >
              <Icon icon="ri:chat-new-line" width={22} height={22} />
            </button>
          </div>
          <nav className="flex items-center space-x-2" aria-label="Document settings">
            <button
              onClick={onToggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={isDark}
              className="grid cursor-pointer size-10 place-items-center rounded-lg text-[#8a8a8c] transition hover:bg-[#f3f3f5] hover:text-[#1a1a1c] dark:hover:bg-[#2a2a2e] dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5314a1]/35"
            >
              {isDark ? (
                <Icon icon="ant-design:sun-outlined" width={22} height={22} />
              ) : (
                <Icon icon="ant-design:moon-outlined" width={22} height={22} />
              )}
            </button>
          </nav>
        </div>
      </header>
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={onNewChat}
        title="Start new chat?"
        message="This will clear your current conversation and close the document. Are you sure you want to continue?"
        confirmText="Start new chat"
        cancelText="Cancel"
      />
    </>
  );
}