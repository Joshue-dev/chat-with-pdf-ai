import { useRef, type KeyboardEvent } from "react";
import { Icon } from "@iconify/react";

interface DocumentUploadAreaProps {
  onUpload: (file: File) => void;
}

export function DocumentUploadArea({ onUpload }: DocumentUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => fileInputRef.current?.click();
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <section
      className="flex items-center justify-center flex-col gap-6 h-full w-full p-8"
      role="region"
      aria-label="Document upload"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.md,.rtf,.odt,.png,.jpg,.jpeg,.gif,.webp,.bmp,.tiff,.tif"
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
        className="sr-only"
        aria-label="Choose document file"
      />

      <div
        className="document-upload-zone relative rounded-2xl border-2 border-dashed transition-all duration-200 flex items-center justify-center flex-col gap-4 min-h-70 w-full max-w-md cursor-pointer border-[#d5d5d8] bg-white dark:border-[#3a3a3e] dark:bg-[#1e1e20] hover:border-[#5314a1]/50 hover:bg-[#faf9ff] dark:hover:bg-[#252528]"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Upload document"
      >
        <div className="flex flex-col items-center gap-3 text-center" aria-hidden="true">
          <div className="upload-icon p-4 rounded-full bg-[#f3f0ff] dark:bg-[#5314a1]/20 text-[#5314a1]">
            <Icon icon="basil:document-upload" width={48} height={48} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#1a1a1c] dark:text-white">Upload a document</h2>
            <p className="mt-1 text-[#8a8a8c] dark:text-[#8a8a8c]">Drag and drop a PDF, DOCX, XLSX, CSV, TXT, MD, RTF, ODT, or image file here, or click to browse</p>
          </div>
        </div>
        <p className="text-sm text-[#b0b0b4] dark:text-[#6a6a6e]">Max file size: 50MB</p>
      </div>

      <div className="upload-hints flex flex-wrap items-center justify-center gap-4 text-sm text-[#8a8a8c] dark:text-[#6a6a6e]" aria-hidden="true">
        <span className="flex items-center gap-1.5">
          <Icon icon="mdi:file-pdf-box" width={16} height={16} />
          PDF
        </span>
        <span className="flex items-center gap-1.5">
          <Icon icon="mdi:file-word" width={16} height={16} />
          DOCX
        </span>
        <span className="flex items-center gap-1.5">
          <Icon icon="mdi:file-excel" width={16} height={16} />
          XLSX / CSV
        </span>
        <span className="flex items-center gap-1.5">
          <Icon icon="mdi:file-document" width={16} height={16} />
          TXT / MD / RTF
        </span>
        <span className="flex items-center gap-1.5">
          <Icon icon="mdi:file-image" width={16} height={16} />
          Images
        </span>
      </div>
    </section>
  );
}