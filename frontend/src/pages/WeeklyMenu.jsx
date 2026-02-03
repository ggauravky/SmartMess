import { useState, useEffect } from "react";
import { format, parseISO, startOfWeek, addDays } from "date-fns";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import Button from "../components/ui/Button";
import { menuAPI } from "../services/api";
import styles from "./WeeklyMenu.module.css";

// Helper: Get local date string (YYYY-MM-DD) - matches backend format
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
      const response = await menuAPI.getWeeklyMenu();
      if (response.data.success && response.data.menus) {
        // Transform API data to our format
        const menus = response.data.menus.map((menu) => ({
          id: menu.id,
          date: parseISO(menu.date),
          dayName: menu.day,
          meals: {
            breakfast: menu.breakfast || [],
            lunch: menu.lunch || [],
            snacks: menu.snacks || [],
            dinner: menu.dinner || [],
          },
        }));
        setWeeklyMenu(menus);
        
        // Set selected day to today if available
        const today = getLocalDateString();
        const todayIndex = menus.findIndex(m => 
          format(m.date, 'yyyy-MM-dd') === today
        );
        if (todayIndex !== -1) {
          setSelectedDay(todayIndex);
        }
      } else {
        // If no menus, create empty week structure
        const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
        const emptyWeek = Array.from({ length: 7 }, (_, i) => ({
          id: `empty-${i}`,
          date: addDays(startDate, i),
          dayName: format(addDays(startDate, i), "EEEE"),
          meals: {
            breakfast: [],
            lunch: [],
            snacks: [],
            dinner: [],
          },
        }));
        setWeeklyMenu(emptyWeek);
      }
    } catch (error) {
      console.error("Failed to fetch weekly menu:", error);
      // Create empty week on error
      const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
      const emptyWeek = Array.from({ length: 7 }, (_, i) => ({
        id: `empty-${i}`,
        date: addDays(startDate, i),
        dayName: format(addDays(startDate, i), "EEEE"),
        meals: {
          breakfast: [],
          lunch: [],
          snacks: [],
          dinner: [],
        },
      }));
      setWeeklyMenu(emptyWeek);
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

  const selectedMenu = weeklyMenu[selectedDay];
  const hasItems = selectedMenu && Object.values(selectedMenu.meals).some(items => items && items.length > 0);

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
              key={day.id}
              className={`${styles.dayTab} ${selectedDay === index ? styles.active : ""}`}
              onClick={() => setSelectedDay(index)}
            >
              <span className={styles.dayName}>{format(day.date, "EEE")}</span>
              <span className={styles.dayDate}>{format(day.date, "d")}</span>
            </button>
          ))}
        </div>

        {/* Selected Day Menu */}
        {selectedMenu && (
          <div className={styles.dayMenu}>
            <h2 className={styles.selectedDayTitle}>
              {selectedMenu.dayName}
              <span>{format(selectedMenu.date, "MMM d")}</span>
            </h2>

            {hasItems ? (
              <div className={styles.mealsGrid}>
                {Object.entries(selectedMenu.meals).map(
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
                      {items && items.length > 0 ? (
                        <ul className={styles.itemList}>
                          {items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className={styles.noItems}>Not available</p>
                      )}
                    </Card>
                  ),
                )}
              </div>
            ) : (
              <Card className={styles.noMenuCard}>
                <div className={styles.noMenu}>
                  <span className={styles.noMenuIcon}>📅</span>
                  <h3>No Menu Available</h3>
                  <p>Menu for this day hasn't been uploaded yet.</p>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WeeklyMenu;
