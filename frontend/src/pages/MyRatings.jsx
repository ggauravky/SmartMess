import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import StarRating from "../components/ui/StarRating";
import Loader from "../components/ui/Loader";
import { ratingAPI } from "../services/api";
import toast from "react-hot-toast";
import styles from "./MyRatings.module.css";

const mealIcons = {
  breakfast: "🌅",
  lunch: "☀️",
  snacks: "🍪",
  dinner: "🌙",
};

const MyRatings = () => {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyRatings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ratingAPI.getMyRatings();
      if (response.data.success) {
        setRatings(response.data.ratings || []);
      } else {
        setError("Failed to load ratings");
      }
    } catch (err) {
      console.error("Error fetching ratings:", err);
      setError("Failed to load your ratings");
      toast.error("Failed to load ratings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyRatings();
  }, [fetchMyRatings]);

  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm("Are you sure you want to delete this rating?")) {
      return;
    }

    try {
      const response = await ratingAPI.deleteRating(ratingId);
      if (response.data.success) {
        toast.success("Rating deleted successfully");
        setRatings(ratings.filter((r) => r.id !== ratingId));
      } else {
        toast.error("Failed to delete rating");
      }
    } catch (err) {
      console.error("Error deleting rating:", err);
      toast.error("Failed to delete rating");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
        <div className={styles.header}>
          <h1>My Ratings</h1>
          <p>View and manage your meal ratings</p>
        </div>

        {error ? (
          <Card className={styles.emptyCard}>
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>⚠️</span>
              <h2>Error Loading Ratings</h2>
              <p>{error}</p>
              <Button onClick={fetchMyRatings}>Try Again</Button>
            </div>
          </Card>
        ) : ratings.length === 0 ? (
          <Card className={styles.emptyCard}>
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📝</span>
              <h2>No Ratings Yet</h2>
              <p>
                You haven't rated any meals yet. Start rating to help improve
                the mess!
              </p>
              <Button onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
          </Card>
        ) : (
          <div className={styles.ratingsList}>
            {ratings.map((rating) => (
              <Card key={rating.id} className={styles.ratingCard}>
                <div className={styles.ratingHeader}>
                  <div className={styles.mealInfo}>
                    <span className={styles.mealIcon}>
                      {mealIcons[rating.meal_type] || "🍽️"}
                    </span>
                    <div>
                      <h3>
                        {rating.meal_type?.charAt(0).toUpperCase() +
                          rating.meal_type?.slice(1)}
                      </h3>
                      <p className={styles.date}>
                        {formatDate(rating.menu_date || rating.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className={styles.ratingValue}>
                    <StarRating rating={rating.rating} readonly size="small" />
                  </div>
                </div>

                {rating.comment && (
                  <p className={styles.comment}>{rating.comment}</p>
                )}

                {rating.menu_items && rating.menu_items.length > 0 && (
                  <div className={styles.menuItems}>
                    {rating.menu_items.map((item, i) => (
                      <span key={i} className={styles.menuItem}>
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                <div className={styles.ratingActions}>
                  <span className={styles.timestamp}>
                    Rated on {formatDate(rating.created_at)}
                  </span>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleDeleteRating(rating.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyRatings;
