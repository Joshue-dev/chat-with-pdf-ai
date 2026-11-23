import { useState, useCallback, useMemo } from "react";
import Header from "./components/Header";
import { DocumentUploadArea } from "./components/DocumentUploadArea";
import { DocumentPanel } from "./components/DocumentPanel";
import { EmptyState } from "./components/EmptyState";
import { ChatPanel } from "./components/ChatPanel";
import { useDarkMode } from "./hooks/useDarkMode";
import { createDocumentFromFile, revokeDocumentUrl } from "./utils/fileUtils";
import { uploadDocument } from "./services/api";
import type { IDocument } from "@iamjariwala/react-doc-viewer";

function App() {
  const [document, setDocument] = useState<IDocument | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isDark, toggleTheme] = useDarkMode();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [value, setValue] = useState("");

  const handleUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const result = await uploadDocument(file);
      const newDocument = createDocumentFromFile(file);
      setDocument(newDocument);
      setDocumentId(result.documentId);
      setConversationId(result.conversationId);
      setUploadError(null);
    } catch (error) {
      setUploadError((error as Error).message);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleCloseDocument = useCallback(() => {
    revokeDocumentUrl(document);
    setDocument(null);
    setDocumentId(null);
    setConversationId(null);
  }, [document]);

  const handleNewChat = useCallback(() => {
    handleCloseDocument();
    setValue("");
  }, [handleCloseDocument]);

  const headerHeight = useMemo(() => 60, []);

  const hasActiveSession = document !== null || value.trim().length > 0;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#fcfcfe] dark:bg-[#141416] text-[#1a1a1c] dark:text-white">
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onNewChat={handleNewChat}
        hasActiveSession={hasActiveSession}
      />
      <div style={{ paddingTop: headerHeight }} className="h-full">
        {document ? (
          <div className="flex h-full w-full overflow-hidden md:flex-row">
            <ChatPanel
              documentId={documentId ?? undefined}
              conversationId={conversationId ?? undefined}
              onConversationIdChange={setConversationId}
            />
            <DocumentPanel
              document={document}
              onClose={handleCloseDocument}
            />
          </div>
        ) : (
          <div className="flex h-full w-full overflow-hidden md:flex-row">
            <div className="flex h-full w-full flex-1 flex-col md:w-1/2 md:flex-none overflow-hidden">
              <h2 className="sr-only">Welcome</h2>
              <DocumentUploadArea onUpload={handleUpload} isUploading={isUploading} error={uploadError} />
            </div>
            <EmptyState />
          </div>
        )}
      </div>
    </main>
  );
}

export default App;