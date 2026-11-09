// import "./App.css";
import EmptyState from "./components/EmptyState";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-gray-100 py-10 max-md:px-10 pr-10">
      <Sidebar />
      <div className="flex flex-col w-full lg:ml-30 h-full">
        <Header />
        <EmptyState />
      </div>
    </main>
  );
}

export default App;
