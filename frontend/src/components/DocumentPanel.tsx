import { useRef } from "react";
import { type DocViewerRef, type IDocument } from "@iamjariwala/react-doc-viewer";
import { DocumentViewer } from "./DocumentViewer";

interface DocumentPanelProps {
  document: IDocument;
  onClose: () => void;
}

export function DocumentPanel({ document, onClose }: DocumentPanelProps) {
  const viewerRef = useRef<DocViewerRef | null>(null);

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden border-l border-[#e4e4e7] dark:border-[#3a3a3e] bg-white dark:bg-[#1e1e20] md:w-1/2 md:flex-none" aria-label="Document viewer">
      <DocumentViewer
        document={document}
        onClose={onClose}
        viewerRef={viewerRef}
      />
    </aside>
  );
}