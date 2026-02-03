import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import { FiCalendar, FiStar, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import MealCard from "../components/MealCard";
import Loader from "../components/ui/Loader";
import { menuAPI, ratingAPI } from "../services/api";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [todayMenu, setTodayMenu] = useState(null);
  const [stats, setStats] = useState({ totalRatings: 0, avgRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // For demo, using mock data - replace with actual API calls
      setTodayMenu({
        _id: "demo123",
        date: new Date(),
        meals: {
          breakfast: ["Poha", "Chai", "Bread Butter", "Banana"],
          lunch: ["Rice", "Dal Tadka", "Paneer Curry", "Roti", "Salad"],
          snacks: ["Samosa", "Tea", "Biscuits"],
          dinner: ["Chapati", "Mix Veg", "Dal Fry", "Rice", "Sweet"],
        },
        ratings: {
          breakfast: 4.2,
          lunch: 4.5,
          snacks: 3.8,
          dinner: 4.0,
        },
      });
      setStats({ totalRatings: 45, avgRating: 4.1 });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getCurrentMeal = () => {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 10) return "breakfast";
    if (hour >= 12 && hour < 15) return "lunch";
    if (hour >= 16 && hour < 18) return "snacks";
    if (hour >= 19 && hour < 22) return "dinner";
    return null;
  };

  if (loading) {
    return (
      <Layout>
        <Loader fullScreen />
      </Layout>
    );
  }

  const currentMeal = getCurrentMeal();

  return (
    <Layout>
      <div className={styles.dashboard}>
        {/* Welcome Section */}
        <section className={styles.welcome}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.greeting}>
              {getGreeting()},{" "}
              <span>{user?.name?.split(" ")[0] || "Student"}!</span>
            </h1>
            <p className={styles.date}>
              <FiCalendar /> {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <div className={styles.welcomeStats}>
            <Card className={styles.statCard}>
              <FiStar className={styles.statIcon} />
              <div>
                <span className={styles.statValue}>{stats.totalRatings}</span>
                <span className={styles.statLabel}>Your Ratings</span>
              </div>
            </Card>
            <Card className={styles.statCard}>
              <FiTrendingUp className={styles.statIcon} />
              <div>
                <span className={styles.statValue}>
                  {stats.avgRating.toFixed(1)}
                </span>
                <span className={styles.statLabel}>Avg Rating</span>
              </div>
            </Card>
          </div>
        </section>

        {/* Current/Next Meal Highlight */}
        {currentMeal && todayMenu && (
          <section className={styles.currentMeal}>
            <div className={styles.sectionHeader}>
              <h2>🍽️ Current Meal</h2>
              <span className={styles.badge}>{currentMeal}</span>
            </div>
            <MealCard
              menuId={todayMenu._id}
              mealType={currentMeal}
              items={todayMenu.meals[currentMeal]}
              averageRating={todayMenu.ratings[currentMeal]}
            />
          </section>
        )}

        {/* Today's Menu Overview */}
        <section className={styles.todayMenu}>
          <div className={styles.sectionHeader}>
            <h2>Today's Menu</h2>
            <Link to="/today-menu" className={styles.viewAll}>
              View Details <FiArrowRight />
            </Link>
          </div>

          {todayMenu ? (
            <div className={styles.mealsGrid}>
              {["breakfast", "lunch", "snacks", "dinner"].map((mealType) => (
                <MealCard
                  key={mealType}
                  menuId={todayMenu._id}
                  mealType={mealType}
                  items={todayMenu.meals[mealType]}
                  averageRating={todayMenu.ratings[mealType]}
                />
              ))}
            </div>
          ) : (
            <Card className={styles.noMenu}>
              <p>No menu available for today</p>
            </Card>
          )}
        </section>

        {/* Quick Actions */}
        <section className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            <Link to="/weekly-menu">
              <Card className={styles.actionCard} hover>
                <span className={styles.actionIcon}>📅</span>
                <h3>Weekly Menu</h3>
                <p>Plan your meals for the week</p>
              </Card>
            </Link>
            <Link to="/my-ratings">
              <Card className={styles.actionCard} hover>
                <span className={styles.actionIcon}>⭐</span>
                <h3>My Ratings</h3>
                <p>View your rating history</p>
              </Card>
            </Link>
            <Link to="/profile">
              <Card className={styles.actionCard} hover>
                <span className={styles.actionIcon}>👤</span>
                <h3>Profile</h3>
                <p>Manage your account</p>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
