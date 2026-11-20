import { Icon } from "@iconify/react";

export function EmptyState() {
  return (
    <div className="flex h-full w-full shrink-0 flex-col overflow-hidden border-l border-[#e4e4e7] dark:border-[#3a3a3e] bg-white dark:bg-[#1e1e20] md:w-1/2 md:flex-none">
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-[#8a8a8c] dark:text-[#8a8a8c] p-8">
          <Icon icon="basil:document-outline" width={64} height={64} className="mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-medium text-[#1a1a1c] dark:text-white">No document loaded</h3>
          <p className="mt-2">Upload a document to view it here</p>
        </div>
      </div>
    </div>
  );
}