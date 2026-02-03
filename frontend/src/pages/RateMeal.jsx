import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import StarRating from "../components/ui/StarRating";
import Loader from "../components/ui/Loader";
import { menuAPI, ratingAPI } from "../services/api";
import toast from "react-hot-toast";
import styles from "./RateMeal.module.css";

const mealInfo = {
  breakfast: { icon: "🌅", time: "7:30 AM - 9:30 AM" },
  lunch: { icon: "☀️", time: "12:00 PM - 2:00 PM" },
  snacks: { icon: "🍪", time: "4:30 PM - 5:30 PM" },
  dinner: { icon: "🌙", time: "7:30 PM - 9:30 PM" },
};

const RateMeal = () => {
  const { menuId, mealType } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [menu, setMenu] = useState(null);
  const [mealItems, setMealItems] = useState([]);
  const [error, setError] = useState(null);

  const fetchMenuData = useCallback(async () => {
    setPageLoading(true);
    setError(null);
    try {
      let response;
      // If menuId is 'today', fetch today's menu
      if (menuId === "today") {
        response = await menuAPI.getTodayMenu();
      } else {
        // Fetch specific menu by date
        response = await menuAPI.getMenuByDate(menuId);
      }

      if (response.data.success && response.data.menu) {
        setMenu(response.data.menu);
        const items = response.data.menu[mealType];
        setMealItems(Array.isArray(items) ? items : []);
      } else {
        setError("No menu available");
        toast.error(
          menuId === "today" ? "No menu available for today" : "Menu not found",
        );
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
      setError("Failed to load menu");
      toast.error("Failed to load menu");
    } finally {
      setPageLoading(false);
    }
  }, [menuId, mealType]);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!menu?.id) {
      toast.error("Menu not found. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const response = await ratingAPI.createRating({
        menu_id: menu.id,
        meal_type: mealType,
        rating,
        comment,
      });

      if (response.data.success) {
        toast.success("Thank you for your feedback! 🎉");
        navigate("/my-ratings");
      } else {
        toast.error(response.data.message || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Rating error:", error);
      toast.error(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <Layout>
        <Loader fullScreen />
      </Layout>
    );
  }

  if (error || !menu) {
    return (
      <Layout>
        <div className={styles.page}>
          <Card className={styles.ratingCard}>
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📭</span>
              <h2>No Menu Available</h2>
              <p>{error || "The menu for this meal is not available."}</p>
              <Button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  const info = mealInfo[mealType] || { icon: "🍽️", time: "" };

  return (
    <Layout>
      <div className={styles.page}>
        <Card className={styles.ratingCard}>
          <div className={styles.header}>
            <span className={styles.icon}>{info.icon}</span>
            <div>
              <h1>
                Rate {mealType?.charAt(0).toUpperCase() + mealType?.slice(1)}
              </h1>
              <p className={styles.time}>{info.time}</p>
              {menu?.date && <p className={styles.date}>Date: {menu.date}</p>}
            </div>
          </div>

          <div className={styles.mealItems}>
            <h3>Menu Items</h3>
            <div className={styles.items}>
              {mealItems.length > 0 ? (
                mealItems.map((item, i) => (
                  <span key={i} className={styles.item}>
                    {item}
                  </span>
                ))
              ) : (
                <p className={styles.noItems}>
                  No menu items available for this meal
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.ratingSection}>
              <label>How was your meal?</label>
              <StarRating rating={rating} onChange={setRating} size="large" />
              <div className={styles.ratingLabels}>
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div className={styles.commentSection}>
              <label htmlFor="comment">Additional Comments (Optional)</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about the meal..."
                maxLength={500}
                rows={4}
              />
              <span className={styles.charCount}>{comment.length}/500</span>
            </div>

            <div className={styles.actions}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading} disabled={rating === 0}>
                Submit Rating
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default RateMeal;
