import { type ForwardedRef } from "react";
import { Icon } from "@iconify/react";
import DocViewer, { type IDocument, type DocViewerRef } from "@iamjariwala/react-doc-viewer";

interface DocumentViewerProps {
  document: IDocument;
  onClose: () => void;
  viewerRef: ForwardedRef<DocViewerRef | null>;
}

export function DocumentViewer({
  document,
  onClose,
  viewerRef,
}: DocumentViewerProps) {
  return (
    <section
      className="flex h-full w-full flex-col overflow-hidden bg-[#f0f0f3] dark:bg-[#1a1a1c]"
      role="region"
      aria-label={`Document viewer: ${document.fileName || "Document"}`}
    >
      <div className="viewer-toolbar flex shrink-0 items-center justify-between gap-2 px-3 py-2 border-b border-[#e4e4e7] dark:border-[#3a3a3e] bg-white dark:bg-[#1e1e20]">
        <button
          onClick={onClose}
          aria-label="Close document"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-[#8a8a8c] dark:text-[#8a8a8c] transition hover:bg-[#f3f3f5] hover:text-[#1a1a1c] dark:hover:bg-[#2a2a2e] dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5314a1]/35"
        >
          <Icon icon="mdi:close" width={18} height={18} />
          <span className="hidden sm:inline">Close</span>
        </button>

        <div className="flex-1" />

        <span className="file-name text-sm text-[#8a8a8c] dark:text-[#8a8a8c] truncate max-w-50" title={document.fileName || "Document"}>
          {document.fileName || "Document"}
        </span>
      </div>

      <div className="viewer-stage flex-1 overflow-hidden" style={{ backgroundColor: "#f0f0f3" }}>
        <DocViewer
          ref={viewerRef}
          documents={[{ uri: document.uri, fileType: document.fileType, fileName: document.fileName, fileData: document.fileData }]}
          config={{
            header: { disableHeader: true },
            dragDrop: { enableDragDrop: false },
            thumbnail: { enableThumbnails: true, sidebarDefaultOpen: false },
            annotations: { enableAnnotations: false },
            fullscreen: { enableFullscreen: true },
            print: { enablePrint: true },
            search: { enableSearch: true },
            textSelection: { enableTextSelection: true },
            keyboard: { enableKeyboardShortcuts: true },
            pdfZoom: { defaultZoom: 1, zoomJump: 0.25 },
            loadingProgress: { enableProgressBar: true },
          }}
          theme={{
            primary: "#5314a1",
            secondary: "#1a1a1c",
            tertiary: "#8a8a8c",
            textPrimary: "#1a1a1c",
            textSecondary: "#535357",
            textTertiary: "#8a8a8c",
          }}
        />
      </div>
    </section>
  );
}