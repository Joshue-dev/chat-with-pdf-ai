import type { IDocument } from "@iamjariwala/react-doc-viewer";

export function getFileTypeFromName(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  const typeMap: Record<string, string> = {
    pdf: "pdf",
    doc: "doc",
    docx: "docx",
    xls: "xls",
    xlsx: "xlsx",
    csv: "csv",
    txt: "txt",
    md: "md",
    rtf: "rtf",
    odt: "odt",
    png: "image",
    jpg: "image",
    jpeg: "image",
    gif: "image",
    webp: "image",
    bmp: "image",
    tiff: "image",
    tif: "image",
  };
  return typeMap[ext || ""] || "unknown";
}

export function createDocumentFromFile(file: File): IDocument {
  const objectUrl = URL.createObjectURL(file);
  const fileType = file.type || getFileTypeFromName(file.name);
  return {
    uri: objectUrl,
    fileType: fileType || "unknown",
    fileName: file.name,
  };
}

export function revokeDocumentUrl(document: IDocument | null): void {
  if (document?.uri) {
    URL.revokeObjectURL(document.uri);
  }
}