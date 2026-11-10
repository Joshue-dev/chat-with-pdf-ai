import { Icon } from "@iconify/react";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

export const UploadDropzone = () => {
  const [error, setError] = useState("");
  const onDrop = useCallback((acceptedFiles: File[]) => {}, []);
  const { isDragActive, getRootProps, getInputProps,  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],

    }
  });
  return (
    <div className="w-full max-w-md lg:max-w-lg mx-auto" {...getRootProps()}>
      <div className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="upload-icon">
            <Icon icon="akar-icons:cloud-upload"  />
          </span>
          <strong>
            {isDragActive ? "Drop your document here" : "Add a document"}
          </strong>
          <span>Drag and drop or click to browse</span>
          <small>PDF, DOC, DOCX, or TXT up to 20 MB</small>
        <input
          {...getInputProps()}
        />
        {error && (
          <p className="upload-error" role="alert">
            <Icon icon="ant-design:warning-filled"  />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}