import { useState, useCallback, useMemo } from "react";
import Header from "./components/Header";
import { DocumentUploadArea } from "./components/DocumentUploadArea";
import { DocumentPanel } from "./components/DocumentPanel";
import { EmptyState } from "./components/EmptyState";
import { ChatPanel } from "./components/ChatPanel";
import { useDarkMode } from "./hooks/useDarkMode";
import { useChat } from "./hooks/useChat";
import { createDocumentFromFile, revokeDocumentUrl } from "./utils/fileUtils";
import type { IDocument } from "@iamjariwala/react-doc-viewer";

function App() {
  const [document, setDocument] = useState<IDocument | null>(null);
  const [isDark, toggleTheme] = useDarkMode();
  const { messages, resetChat } = useChat();
  const [value, setValue] = useState("");

  const handleUpload = useCallback((file: File) => {
    const newDocument = createDocumentFromFile(file);
    setDocument(newDocument);
    resetChat();
  }, [resetChat]);

  const handleCloseDocument = useCallback(() => {
    revokeDocumentUrl(document);
    setDocument(null);
    resetChat();
  }, [document, resetChat]);

  const handleNewChat = useCallback(() => {
    handleCloseDocument();
    setValue("");
  }, [handleCloseDocument]);

  const headerHeight = useMemo(() => 60, []);

  const hasActiveSession = document !== null || messages.length > 2 || value.trim().length > 0;

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-[#fcfcfe] dark:bg-[#141416] text-[#1a1a1c] dark:text-white">
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onNewChat={handleNewChat}
        hasActiveSession={hasActiveSession}
      />
      <div style={{ paddingTop: headerHeight }} className="h-full">
        {document ? (
          <div className="flex h-full min-h-0 w-full flex-col md:flex-row">
            <ChatPanel
            />
            <DocumentPanel
              document={document}
              onClose={handleCloseDocument}
            />
          </div>
        ) : (
          <div className="flex h-full min-h-0 w-full flex-col md:flex-row">
            <div className="flex min-h-0 w-full flex-1 flex-col md:w-1/2 md:flex-none">
              <h2 className="sr-only">Welcome</h2>
              <DocumentUploadArea onUpload={handleUpload} />
            </div>
            <EmptyState />
          </div>
        )}
      </div>
    </main>
  );
}

export default App;