import { Icon } from "@iconify/react";
import { useState } from "react";

const navItems = [
  { label: "Conversation", icon: 'bi:chat-left' },
  { label: "Summarise", icon: 'bi:file-text' },
  { label: "Documents", icon: 'bi:archive' },
  { label: "Other tools", icon: 'bi:layout-grid' },
  { label: "Help & Support", icon: 'bi:help-circle' },
];

const Sidebar = ({
  open,
  onToggle,
  onNavigate,
  onLogout,
}: {
  open: boolean;
  onToggle: () => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}) => {
  const [accountOpen, setAccountOpen] = useState(false);
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-top">
        <Icon icon='clarity:document-solid-badged' onToggle={onToggle} />
        <button
          className="mobile-close"
          onClick={onToggle}
          aria-label="Close navigation"
        >
          <Icon icon='bi:x'  />
        </button>
      </div>
      <nav aria-label="Primary navigation" className="side-nav">
        {navItems.map(({ label, icon }) => (
          <button
            key={label}
            className="nav-item"
            onClick={() => onNavigate(label.toLowerCase().replace(" ", "-"))}
          >
            <Icon icon={icon} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="profile">
        <div className="profile-avatar">B</div>
        <span>Stephen Jude</span>
        <div className="account-wrap">
          <button
            aria-label="Account menu"
            onClick={() => setAccountOpen(!accountOpen)}
          >
            <Icon icon='bi:three-dots-vertical'  />
          </button>
          {accountOpen && (
            <div className="account-menu">
              <button onClick={onLogout}>
                <Icon icon='bi:box-arrow-right'  />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
