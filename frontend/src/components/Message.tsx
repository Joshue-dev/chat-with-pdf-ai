import { Icon } from "@iconify/react";

export const ChatMessage = ({
  children,
  avatar = "",
  feedback = false,
  isAI = true,
}: {
  children: React.ReactNode;
  avatar?: string | boolean;
  feedback?: boolean;
  isAI: boolean;
}) => {
  return (
    <div
      className={`flex gap-2 p-2 max-w-content ${isAI ? "items-start justify-start" : "rounded-md self-end justify-end flex-row-reverse"}`}
    >
      <div
        className={
          isAI
            ? "flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full"
            : "avatar-spacer"
        }
      >
        {isAI && <Icon icon="thesvg:openai-chatgpt" />}
      </div>
      <div className="message-content">
        {children}
        {isAI && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Icon icon="ant-design:copy-outlined" />{" "}
            <Icon icon="akar-icons:thumbs-up" />{" "}
            <Icon icon="akar-icons:thumbs-down" />{" "}
          </div>
        )}
      </div>
    </div>
  );
};
