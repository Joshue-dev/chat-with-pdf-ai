// import "./App.css";
import EmptyState from "./components/EmptyState";
import Header from "./components/Header";
import { ChatPage } from "./ui/chatPage";
// import Sidebar from "./components/Sidebar";

function App() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-gray-100">
      {/* <Header /> */}
      <div className="flex flex-col w-full h-full">
        <ChatPage />
      </div>
    </main>
  );
}

export default App;
