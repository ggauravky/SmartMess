import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import StarRating from "../components/ui/StarRating";
import Loader from "../components/ui/Loader";
import { ratingAPI } from "../services/api";
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
  const [mealItems, setMealItems] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    setMealItems(["Rice", "Dal Tadka", "Paneer Curry", "Roti", "Salad"]);
  }, [menuId, mealType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);
    try {
      await ratingAPI.createRating({
        menu: menuId,
        mealType,
        rating,
        comment,
      });
      toast.success("Thank you for your feedback! 🎉");
      navigate("/my-ratings");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

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
            </div>
          </div>

          <div className={styles.mealItems}>
            <h3>Today's Items</h3>
            <div className={styles.items}>
              {mealItems.map((item, i) => (
                <span key={i} className={styles.item}>
                  {item}
                </span>
              ))}
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
