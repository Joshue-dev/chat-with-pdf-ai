import { Icon } from "@iconify/react";
import { ChatMessage } from "../components/Message";
import { useState } from "react";

export const ChatPage = () => {
  const [value, setValue] = useState("");
  return (
    <section className="chat-panel flex w-full h-full items-center justify-center">
      <div className="flex flex-col w-full h-full justify-between p-4">
        <div className="flex flex-col gap-2">
          <ChatMessage isAI feedback={true}>
            Hello! How can I assist you today?
          </ChatMessage>
          <ChatMessage isAI={false} feedback={false}>
            I have a question about the document I uploaded.
          </ChatMessage>
        </div>
        <form
          id="composer"
          className="border border-gray-300 rounded-md flex items-center gap-2 p-3"
          // onSubmit={(event) => {
          //   event.preventDefault();
          //   if (value.trim()) {
          //     setSent(true);
          //     setValue("");
          //   }
          // }}
        >
          {/* <button type="button" aria-label="Add attachment">
          <Icon size={21} />
        </button> */}
          <span className="composer-divider" />
          <input
            aria-label="Ask a question"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Ask a question or Use @ to mention document"
            className="flex-1 bg-transparent focus:outline-none *:placeholder-gray-400 p-2"
          />
          <button
            className="bg-black disabled:bg-gray-500 size-6 rounded-full flex items-center justify-center"
            type="submit"
            aria-label="Send question"
          >
            <Icon icon="bi:send-fill" className="text-white" />
          </button>
        </form>
      </div>
      <DocumentPanel />
    </section>
  );
};

const DocumentPanel = () => {
  const [page, setPage] = useState(1);
  return (
    <section className="w-full h-full flex flex-col border-l border-gray-300">
      <div className="pdf-toolbar">
        <button className="active-tool" aria-label="Select text">
          <Icon icon="mdi:mouse-pointer" />
        </button>
        <button aria-label="Document view">
          <Icon icon="mdi:file-text" />
        </button>
        <button aria-label="Zoom in">
          <Icon icon="mdi:zoom-in" />
        </button>
        <button aria-label="Zoom out">
          <Icon icon="mdi:zoom-out" />
        </button>
        <div className="page-control">
          <span>Page</span>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            aria-label="Previous page"
          >
            <Icon icon="mdi:chevron-left" />
          </button>
          <b>{page}</b>
          <span>of 100</span>
          <button
            onClick={() => setPage(Math.min(100, page + 1))}
            aria-label="Next page"
          >
            <Icon icon="mdi:chevron-right" />
          </button>
        </div>
      </div>
      <div className="pdf-stage">
        {/* <PdfPage /> */}
        <div className="vertical-label">
          arXiv:2311.17835v1 [cs.LG] 29 Nov 2023
        </div>
      </div>
    </section>
  );
};
