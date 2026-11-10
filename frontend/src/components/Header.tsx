import { Icon } from "@iconify/react";

const Header = () => {
  return (
    <header className="left-0 top-0 fixed w-full">
      <div className="flex *:items-center justify-between px-4 py-2">
        <div className="flex gap-4">
          <Icon icon='arcticons:document-scanner' />
          <button className="new-doc" aria-label="Create new document">
            <Icon icon="ri:chat-new-line" />
          </button>
        </div>
        <nav className="flex items-center space-x-2" aria-label="Document settings">
          <button className="flex items-center gap-1" aria-label="Select model">
            <Icon icon="grommet-icons:globe" />
            GPT-3.5 <Icon icon="carbon:chevron-down" />
          </button>
          <button className="language">
            <span>🇬🇧</span> EN
          </button>
          <button aria-label="Toggle dark mode">
            <Icon icon="ant-design:moon-outlined" />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
