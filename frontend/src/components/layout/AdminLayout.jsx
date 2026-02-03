import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiHome,
  FiCalendar,
  FiStar,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import styles from "./AdminLayout.module.css";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: "/admin/dashboard", label: "Dashboard", icon: FiHome },
    { path: "/admin/manage-menu", label: "Manage Menu", icon: FiCalendar },
    { path: "/admin/ratings", label: "View Ratings", icon: FiStar },
    { path: "/admin/students", label: "Students", icon: FiUsers },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/admin/dashboard" className={styles.logo}>
            <span className={styles.logoIcon}>🍽️</span>
            <span className={styles.logoText}>SmartMess</span>
          </Link>
          <span className={styles.adminBadge}>Admin</span>
        </div>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.navLink} ${isActive(link.path) ? styles.active : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <link.icon className={styles.navIcon} />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <span className={styles.userName}>{user?.name || "Admin"}</span>
              <span className={styles.userRole}>Administrator</span>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <div className={styles.mainWrapper}>
        <header className={styles.topBar}>
          <button
            className={styles.menuBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <div className={styles.topBarRight}>
            <span className={styles.welcomeText}>
              Welcome back,{" "}
              <strong>{user?.name?.split(" ")[0] || "Admin"}</strong>
            </span>
          </div>
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
