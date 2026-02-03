import { useState, useEffect } from "react";
import { format } from "date-fns";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import StarRating from "../components/ui/StarRating";
import Loader from "../components/ui/Loader";
import styles from "./MyRatings.module.css";

const mealIcons = {
  breakfast: "🌅",
  lunch: "☀️",
  snacks: "🍪",
  dinner: "🌙",
};

const MyRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      // Mock data - replace with actual API call
      setRatings([
        {
          _id: "1",
          mealType: "lunch",
          rating: 4,
          comment: "Great paneer curry today! Rice was also good.",
          ratingDate: new Date(),
          menu: { date: new Date() },
        },
        {
          _id: "2",
          mealType: "breakfast",
          rating: 5,
          comment: "Loved the aloo paratha!",
          ratingDate: new Date(Date.now() - 86400000),
          menu: { date: new Date(Date.now() - 86400000) },
        },
        {
          _id: "3",
          mealType: "dinner",
          rating: 3,
          comment: "Average food today.",
          ratingDate: new Date(Date.now() - 172800000),
          menu: { date: new Date(Date.now() - 172800000) },
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch ratings:", error);
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
          <h1>My Ratings</h1>
          <p>Your meal rating history</p>
        </header>

        {ratings.length > 0 ? (
          <div className={styles.ratingsList}>
            {ratings.map((rating) => (
              <Card key={rating._id} className={styles.ratingCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.mealInfo}>
                    <span className={styles.icon}>
                      {mealIcons[rating.mealType]}
                    </span>
                    <div>
                      <h3>
                        {rating.mealType.charAt(0).toUpperCase() +
                          rating.mealType.slice(1)}
                      </h3>
                      <span className={styles.date}>
                        {format(new Date(rating.ratingDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  <StarRating rating={rating.rating} readonly size="small" />
                </div>
                {rating.comment && (
                  <p className={styles.comment}>"{rating.comment}"</p>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className={styles.emptyState}>
            <span className={styles.emptyIcon}>⭐</span>
            <h2>No Ratings Yet</h2>
            <p>
              You haven't rated any meals yet. Start rating to see your history
              here!
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default MyRatings;
