import { type ForwardedRef } from "react";
import DocViewer, {
  type IDocument,
  type DocViewerRef,
} from "@iamjariwala/react-doc-viewer";

interface DocumentViewerProps {
  document: IDocument;
  onClose: () => void;
  viewerRef: ForwardedRef<DocViewerRef | null>;
}

export function DocumentViewer({
  document: doc,
  viewerRef,
}: DocumentViewerProps) {

  return (
    <section
      className="flex h-full min-h-0 w-full flex-col bg-[#f0f0f3] dark:bg-[#1a1a1c]"
      role="region"
      aria-label={`Document viewer: ${doc.fileName || "Document"}`}
    >
      <div
        className="viewer-stage flex-1 min-h-0"
        style={{ backgroundColor: "#f0f0f3" }}
      >
        <DocViewer
          ref={viewerRef}
          documents={[
            {
              uri: doc.uri,
              fileType: doc.fileType,
              fileName: doc.fileName,
              fileData: doc.fileData,
            },
          ]}
          config={{
            header: {
              disableHeader: true,
              disableFileName: true,
              retainURLParams: false,
            },
            pdfVerticalScrollByDefault: true,
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
