import { Icon } from "@iconify/react";

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-white p-4 fixed top-0 left-0 w-full z-10">
      <button
        className="mobile-menu-button lg:hidden"
        // onClick={onMenu}
        aria-label="Open conversations"
      >
        <Icon icon="andrsrxn:menu-burger" />
      </button>
      <div className="model-switcher">
        <span>⚡ GPT-3.5</span>
        <strong>✣ GPT-4</strong>
        <span>AI Claude</span>
        <span>AI Claude 2</span>
      </div>
      <div className="header-actions">
        <button className="lang">EN ↑</button>
      </div>
    </header>
  );
};

export default Header;
