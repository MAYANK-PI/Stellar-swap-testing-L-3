import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "🏠 Dashboard", path: "/" },
    { name: "🔄 Swap", path: "/swap" },
    { name: "📜 Contract", path: "/contract" },
    { name: "📡 Events", path: "/events" },
    { name: "📊 Status", path: "/status" },
  ];

  return (
    <div className="sidebar">
      <h2 className="logo">⚡ Stellar Swap</h2>

      <div className="menu">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={
              location.pathname === item.path
                ? "menu-item active"
                : "menu-item"
            }
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}