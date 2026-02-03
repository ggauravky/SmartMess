import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  FiHome, FiCalendar, FiStar, FiUser, FiLogOut, FiMenu, FiX 
} from 'react-icons/fi'
import { MdRestaurantMenu } from 'react-icons/md'
import styles from './Navbar.module.css'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/today-menu', label: "Today's Menu", icon: MdRestaurantMenu },
    { path: '/weekly-menu', label: 'Weekly Menu', icon: FiCalendar },
    { path: '/my-ratings', label: 'My Ratings', icon: FiStar },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/dashboard" className={styles.logo}>
          <span className={styles.logoIcon}>🍽️</span>
          <span className={styles.logoText}>SmartMess</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.navLink} ${isActive(link.path) ? styles.active : ''}`}
            >
              <link.icon className={styles.navIcon} />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* User Menu */}
        <div className={styles.userSection}>
          <Link to="/profile" className={styles.userInfo}>
            <div className={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className={styles.userName}>{user?.name || 'User'}</span>
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <FiLogOut />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className={styles.mobileNav}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.mobileNavLink} ${isActive(link.path) ? styles.active : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <link.icon className={styles.navIcon} />
              <span>{link.label}</span>
            </Link>
          ))}
          <Link 
            to="/profile" 
            className={styles.mobileNavLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            <FiUser className={styles.navIcon} />
            <span>Profile</span>
          </Link>
          <button onClick={handleLogout} className={styles.mobileLogout}>
            <FiLogOut className={styles.navIcon} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
