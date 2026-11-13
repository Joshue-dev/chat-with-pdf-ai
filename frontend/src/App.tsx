// import "./App.css";
import EmptyState from "./components/EmptyState";
import Header from "./components/Header";
import { ChatPage } from "./ui/chatPage";
// import Sidebar from "./components/Sidebar";

function App() {
  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-[#fcfcfe] text-[#1a1a1c]">
      {/* <Header /> */}
      <div className="flex h-full min-h-0 w-full flex-col">
        <ChatPage />
      </div>
    </main>
  );
}

export default App;
