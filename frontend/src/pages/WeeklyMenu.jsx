import { useState, useEffect } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import styles from "./WeeklyMenu.module.css";

const mealIcons = {
  breakfast: "🌅",
  lunch: "☀️",
  snacks: "🍪",
  dinner: "🌙",
};

const WeeklyMenu = () => {
  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeeklyMenu();
  }, []);

  const fetchWeeklyMenu = async () => {
    try {
      // Mock data - replace with actual API call
      const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
      const mockMenu = Array.from({ length: 7 }, (_, i) => ({
        _id: `menu${i}`,
        date: addDays(startDate, i),
        dayName: format(addDays(startDate, i), "EEEE"),
        meals: {
          breakfast: ["Poha", "Chai", "Bread", "Fruits"],
          lunch: ["Rice", "Dal", "Sabzi", "Roti", "Salad"],
          snacks: ["Samosa", "Tea"],
          dinner: ["Chapati", "Curry", "Dal", "Rice"],
        },
      }));
      setWeeklyMenu(mockMenu);
    } catch (error) {
      console.error("Failed to fetch weekly menu:", error);
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
          <h1>Weekly Menu</h1>
          <p>Plan your meals for the entire week</p>
        </header>

        {/* Day Selector */}
        <div className={styles.dayTabs}>
          {weeklyMenu.map((day, index) => (
            <button
              key={day._id}
              className={`${styles.dayTab} ${selectedDay === index ? styles.active : ""}`}
              onClick={() => setSelectedDay(index)}
            >
              <span className={styles.dayName}>{format(day.date, "EEE")}</span>
              <span className={styles.dayDate}>{format(day.date, "d")}</span>
            </button>
          ))}
        </div>

        {/* Selected Day Menu */}
        {weeklyMenu[selectedDay] && (
          <div className={styles.dayMenu}>
            <h2 className={styles.selectedDayTitle}>
              {weeklyMenu[selectedDay].dayName}
              <span>{format(weeklyMenu[selectedDay].date, "MMM d")}</span>
            </h2>

            <div className={styles.mealsGrid}>
              {Object.entries(weeklyMenu[selectedDay].meals).map(
                ([mealType, items]) => (
                  <Card key={mealType} className={styles.mealCard}>
                    <div className={styles.mealHeader}>
                      <span className={styles.mealIcon}>
                        {mealIcons[mealType]}
                      </span>
                      <h3>
                        {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                      </h3>
                    </div>
                    <ul className={styles.itemList}>
                      {items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </Card>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WeeklyMenu;
