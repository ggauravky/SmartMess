import { useState, useEffect } from "react";
import { format } from "date-fns";
import Layout from "../components/layout/Layout";
import MealCard from "../components/MealCard";
import Loader from "../components/ui/Loader";
import styles from "./TodayMenu.module.css";

const TodayMenu = () => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayMenu();
  }, []);

  const fetchTodayMenu = async () => {
    try {
      // Mock data - replace with actual API call
      setMenu({
        _id: "demo123",
        date: new Date(),
        meals: {
          breakfast: ["Aloo Paratha", "Curd", "Pickle", "Chai", "Fruits"],
          lunch: [
            "Jeera Rice",
            "Dal Makhani",
            "Butter Paneer",
            "Roti",
            "Salad",
            "Raita",
          ],
          snacks: ["Veg Cutlet", "Green Chutney", "Tea", "Bread Pakora"],
          dinner: ["Veg Biryani", "Raita", "Mirchi Ka Salan", "Gulab Jamun"],
        },
        ratings: {
          breakfast: 4.3,
          lunch: 4.6,
          snacks: 3.9,
          dinner: 4.4,
        },
      });
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
                menuId={menu._id}
                mealType={mealType}
                items={menu.meals[mealType]}
                averageRating={menu.ratings[mealType]}
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
