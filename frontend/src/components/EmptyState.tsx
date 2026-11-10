import { Icon } from '@iconify/react';
import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
const EmptyState = () => {
  return (
    <section className="flex items-center justify-center flex-col gap-4 h-full text-center text-gray-600">
      <div className="document-illustration" aria-hidden="true">
        <Icon icon="basil:document-outline" />
      </div>
      <h1>No document yet</h1>
      <p>
        Upload a document to start asking questions and exploring it with
        AskYourPDF.
      </p>
    </section>
  );
};

export default EmptyState;

