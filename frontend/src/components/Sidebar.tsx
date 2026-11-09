import { Icon } from "@iconify/react";

const Sidebar = () => {
  return (
    <nav
      className="bg-black text-white top-0 left-0 fixed h-full p-4 text-4xl z-50"
      aria-label="Workspace tools"
    >
      {/* <Logo dark /> */}
      <div className="flex flex-col gap-4">
        <Icon icon="bx:message-square" aria-label="Messages" />
        <Icon icon="bi:cloud-upload" aria-label="Upload" />
      </div>
      <div className="flex flex-col gap-4 absolute bottom-0 left-0 p-4">
        <Icon icon="boxicons:help-circle" aria-label="Help" />
        <Icon icon="bi:gear" aria-label="Settings" />
        <Icon icon="cuida:logout-outline" aria-label="Log out" />
      </div>
    </nav>
  );
};

export default Sidebar;
