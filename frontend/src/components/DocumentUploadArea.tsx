import { useCallback, type KeyboardEvent } from "react";
import { useDropzone } from "react-dropzone";
import { Icon } from "@iconify/react";

interface DocumentUploadAreaProps {
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
  error?: string | null;
}

export function DocumentUploadArea({ onUpload, isUploading = false, error = null }: DocumentUploadAreaProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!isUploading && acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [isUploading, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      // "application/msword": [".doc"],
      // "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      // "application/vnd.ms-excel": [".xls"],
      // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      // "text/csv": [".csv"],
      // "text/plain": [".txt", ".md", ".rtf"],
      // "application/vnd.oasis.opendocument.text": [".odt"],
      // "image/png": [".png"],
      // "image/jpeg": [".jpg", ".jpeg"],
      // "image/gif": [".gif"],
      // "image/webp": [".webp"],
      // "image/bmp": [".bmp"],
      // "image/tiff": [".tiff", ".tif"],
    },
    maxFiles: 1,
    disabled: isUploading,
    noClick: false,
    noKeyboard: false,
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !isUploading) {
      e.preventDefault();
      open();
    }
  };

  return (
    <section
      className="flex items-center justify-center flex-col gap-6 h-full w-full p-8"
      role="region"
      aria-label="Document upload"
    >
      {error && (
        <div
          className="w-full max-w-md rounded-lg border border-[#f57c6c] bg-[#fef2f2] p-4 text-sm text-[#f57c6c] dark:border-[#f57c6c] dark:bg-[#451a1a] dark:text-[#f57c6c]"
          role="alert"
        >
          {error}
        </div>
      )}

      <div
        {...getRootProps({
          className: `document-upload-zone relative rounded-2xl border-2 border-dashed transition-all duration-200 flex items-center justify-center flex-col gap-4 min-h-70 w-full max-w-md cursor-pointer ${
            isUploading
              ? "opacity-50 cursor-not-allowed border-[#d5d5d8] bg-white dark:border-[#3a3a3e] dark:bg-[#1e1e20]"
              : isDragActive
                ? "border-[#5314a1] bg-[#f3f0ff] dark:border-[#5314a1] dark:bg-[#5314a1]/20"
                : "border-[#d5d5d8] bg-white dark:border-[#3a3a3e] dark:bg-[#1e1e20] hover:border-[#5314a1]/50 hover:bg-[#faf9ff] dark:hover:bg-[#252528]"
          }`,
          onKeyDown: handleKeyDown,
          tabIndex: 0,
          role: "button",
          "aria-label": isUploading ? "Uploading document..." : "Upload document",
          "aria-disabled": isUploading,
        })}
      >
        <input {...getInputProps()} aria-label="Choose document file" />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3 text-center" aria-hidden="true">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#5314a1]/20 border-t-[#5314a1]" />
            <p className="text-xl font-semibold text-[#1a1a1c] dark:text-white">Uploading document...</p>
            <p className="text-[#8a8a8c] dark:text-[#8a8a8c]">Please wait while we process your file</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center" aria-hidden="true">
            <div
              className={`upload-icon p-4 rounded-full transition-colors duration-200 ${
                isDragActive
                  ? "bg-[#5314a1] text-white"
                  : "bg-[#f3f0ff] dark:bg-[#5314a1]/20 text-[#5314a1]"
              }`}
            >
              <Icon icon="basil:document-upload" width={48} height={48} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1a1a1c] dark:text-white">
                {isDragActive ? "Drop the file here" : "Upload a document"}
              </h2>
              <p className="mt-1 text-[#8a8a8c] dark:text-[#8a8a8c]">
                {isDragActive
                  ? "Release to upload your document"
                  : "Drag and drop a PDF here, or click to browse"}
              </p>
            </div>
          </div>
        )}
        {!isUploading && <p className="text-sm text-[#b0b0b4] dark:text-[#6a6a6e]">Max file size: 50MB</p>}
      </div>

      {!isUploading && (
        <div className="upload-hints flex flex-wrap items-center justify-center gap-4 text-sm text-[#8a8a8c] dark:text-[#6a6a6e]" aria-hidden="true">
          <span className="flex items-center gap-1.5">
            <Icon icon="mdi:file-pdf-box" width={16} height={16} />
            PDF
          </span>
          {/* <span className="flex items-center gap-1.5">
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
          </span> */}
        </div>
      )}
    </section>
  );
}