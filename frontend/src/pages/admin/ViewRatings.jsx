import { useState, useEffect } from "react";
import { format } from "date-fns";
import { FiFilter, FiDownload } from "react-icons/fi";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import StarRating from "../../components/ui/StarRating";
import styles from "./ViewRatings.module.css";

const ViewRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setRatings([
      {
        _id: "1",
        student: { name: "John Doe", rollNumber: "21CS101" },
        mealType: "lunch",
        rating: 5,
        comment: "Excellent food!",
        ratingDate: new Date(),
      },
      {
        _id: "2",
        student: { name: "Jane Smith", rollNumber: "21CS102" },
        mealType: "breakfast",
        rating: 4,
        comment: "Good breakfast",
        ratingDate: new Date(Date.now() - 3600000),
      },
      {
        _id: "3",
        student: { name: "Mike Johnson", rollNumber: "21CS103" },
        mealType: "dinner",
        rating: 3,
        comment: "Average",
        ratingDate: new Date(Date.now() - 7200000),
      },
    ]);
  }, [filter]);

  const filteredRatings =
    filter === "all" ? ratings : ratings.filter((r) => r.mealType === filter);

  return (
    <AdminLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1>View Ratings</h1>
            <p>Student feedback and ratings</p>
          </div>
          <Button variant="outline" icon={FiDownload}>
            Export
          </Button>
        </header>

        <Card className={styles.filterCard}>
          <FiFilter className={styles.filterIcon} />
          <span>Filter by meal:</span>
          <div className={styles.filterButtons}>
            {["all", "breakfast", "lunch", "snacks", "dinner"].map((type) => (
              <button
                key={type}
                className={`${styles.filterBtn} ${filter === type ? styles.active : ""}`}
                onClick={() => setFilter(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </Card>

        <div className={styles.ratingsList}>
          {filteredRatings.map((rating) => (
            <Card key={rating._id} className={styles.ratingCard}>
              <div className={styles.ratingHeader}>
                <div className={styles.studentInfo}>
                  <div className={styles.avatar}>
                    {rating.student.name.charAt(0)}
                  </div>
                  <div>
                    <h4>{rating.student.name}</h4>
                    <span>{rating.student.rollNumber}</span>
                  </div>
                </div>
                <div className={styles.ratingMeta}>
                  <span className={styles.mealBadge}>{rating.mealType}</span>
                  <StarRating rating={rating.rating} readonly size="small" />
                </div>
              </div>
              {rating.comment && (
                <p className={styles.comment}>"{rating.comment}"</p>
              )}
              <span className={styles.date}>
                {format(new Date(rating.ratingDate), "MMM d, yyyy • h:mm a")}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewRatings;
