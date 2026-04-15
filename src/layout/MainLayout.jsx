import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  return (
    <div>
      <Sidebar />

      <div className="page-content">
        {children}
      </div>
    </div>
  );
}