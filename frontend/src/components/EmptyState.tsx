import { Icon } from '@iconify/react';
const EmptyState = () => {
  return (
    <section className="empty-state">
      <div className="document-illustration" aria-hidden="true">
        <Icon icon="basil:document-outline" />
        <span>
          <Icon icon="akar-icons:cloud-upload" />
        </span>
      </div>
      <h1>No document yet</h1>
      <p>
        Upload a document to start asking questions and exploring it with
        AskYourPDF.
      </p>
      {/* <label className="upload-button" htmlFor={inputId}>
        <Icon icon="akar-icons:cloud-upload" /> Upload document
      </label> */}
      <input
        // id={inputId}
        className="sr-only"
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        // onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <p className="drop-hint">or drag and drop a PDF here</p>
    </section>
  );
};

export default EmptyState;
