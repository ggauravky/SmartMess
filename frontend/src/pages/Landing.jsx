import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiArrowRight, FiStar, FiCalendar, FiSmartphone } from "react-icons/fi";
import Button from "../components/ui/Button";
import styles from "./Landing.module.css";

const Landing = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const features = [
    {
      icon: FiCalendar,
      title: "Daily & Weekly Menus",
      description:
        "View what's cooking today and plan your meals for the entire week.",
    },
    {
      icon: FiStar,
      title: "Rate Your Meals",
      description:
        "Share your feedback with star ratings and comments to improve mess quality.",
    },
    {
      icon: FiSmartphone,
      title: "Mobile Friendly",
      description:
        "Access your mess menu and rate meals on the go from any device.",
    },
  ];

  return (
    <div className={styles.landing}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🍽️</span>
            <span className={styles.logoText}>SmartMess</span>
          </div>
          <div className={styles.navLinks}>
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </nav>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Your Campus Mess,
            <span className={styles.highlight}> Made Smart</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Discover daily menus, rate your meals, and help improve the dining
            experience for everyone. Your feedback matters!
          </p>
          <div className={styles.heroCta}>
            <Link to="/register">
              <Button size="large" icon={FiArrowRight} iconPosition="right">
                Start Rating Meals
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="large">
                I have an account
              </Button>
            </Link>
          </div>
        </div>

        <div className={styles.heroImage}>
          <div className={styles.mockup}>
            <div className={styles.mockupHeader}>
              <span>Today's Lunch</span>
              <span className={styles.mockupRating}>⭐ 4.2</span>
            </div>
            <div className={styles.mockupItems}>
              <div className={styles.mockupItem}>🍚 Rice</div>
              <div className={styles.mockupItem}>🍛 Dal Tadka</div>
              <div className={styles.mockupItem}>🥗 Salad</div>
              <div className={styles.mockupItem}>🍨 Sweet</div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Why SmartMess?</h2>
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <feature.icon />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2>Ready to improve your mess experience?</h2>
        <p>Join hundreds of students already using SmartMess.</p>
        <Link to="/register">
          <Button size="large">Create Free Account</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2024 SmartMess. Made with ❤️ for better campus dining.</p>
      </footer>
    </div>
  );
};

export default Landing;
