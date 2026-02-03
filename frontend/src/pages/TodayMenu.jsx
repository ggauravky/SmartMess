import { useState, useEffect } from "react";
import { format } from "date-fns";
import Layout from "../components/layout/Layout";
import MealCard from "../components/MealCard";
import Loader from "../components/ui/Loader";
import { menuAPI } from "../services/api";
import styles from "./TodayMenu.module.css";

const TodayMenu = () => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayMenu();
  }, []);

  const fetchTodayMenu = async () => {
    try {
      const response = await menuAPI.getTodayMenu();
      if (response.data.success) {
        setMenu(response.data.menu);
      }
    } catch (error) {
      console.error("Failed to fetch menu:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loader fullScreen />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1>Today's Menu</h1>
            <p className={styles.date}>
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
        </header>

        {menu ? (
          <div className={styles.mealsGrid}>
            {["breakfast", "lunch", "snacks", "dinner"].map((mealType) => (
              <MealCard
                key={mealType}
                menu={menu}
                mealType={mealType}
                items={menu[mealType] || []}
                averageRating={0}
              />
            ))}
          </div>
        ) : (
          <div className={styles.noMenu}>
            <span className={styles.emoji}>🍽️</span>
            <h2>No Menu Available</h2>
            <p>Today's menu hasn't been uploaded yet. Check back later!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TodayMenu;
