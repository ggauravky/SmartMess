import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  FiUsers,
  FiStar,
  FiCalendar,
  FiTrendingUp,
  FiPlus,
  FiBarChart2,
} from "react-icons/fi";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRatings: 0,
    avgRating: 0,
    todayRatings: 0,
  });
  const [recentRatings, setRecentRatings] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      totalStudents: 245,
      totalRatings: 1832,
      avgRating: 4.2,
      todayRatings: 67,
    });
    setRecentRatings([
      {
        id: 1,
        student: "John Doe",
        mealType: "lunch",
        rating: 5,
        time: "10 mins ago",
      },
      {
        id: 2,
        student: "Jane Smith",
        mealType: "breakfast",
        rating: 4,
        time: "25 mins ago",
      },
      {
        id: 3,
        student: "Mike Johnson",
        mealType: "lunch",
        rating: 3,
        time: "1 hour ago",
      },
    ]);
  }, []);

  const statCards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: FiUsers,
      color: "#3b82f6",
    },
    {
      label: "Total Ratings",
      value: stats.totalRatings,
      icon: FiStar,
      color: "#f59e0b",
    },
    {
      label: "Average Rating",
      value: stats.avgRating.toFixed(1),
      icon: FiTrendingUp,
      color: "#22c55e",
    },
    {
      label: "Today's Ratings",
      value: stats.todayRatings,
      icon: FiBarChart2,
      color: "#8b5cf6",
    },
  ];

  return (
    <AdminLayout>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <div>
            <h1>Admin Dashboard</h1>
            <p className={styles.date}>
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <Link to="/admin/manage-menu">
            <Button icon={FiPlus}>Add Today's Menu</Button>
          </Link>
        </header>

        <div className={styles.statsGrid}>
          {statCards.map((stat, index) => (
            <Card key={index} className={styles.statCard}>
              <div
                className={styles.statIcon}
                style={{
                  backgroundColor: `${stat.color}15`,
                  color: stat.color,
                }}
              >
                <stat.icon />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </Card>
          ))}
        </div>

        <section className={styles.section}>
          <h2>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            <Link to="/admin/manage-menu">
              <Card className={styles.actionCard} hover>
                <FiCalendar className={styles.actionIcon} />
                <h3>Manage Menu</h3>
                <p>Add or edit daily menus</p>
              </Card>
            </Link>
            <Link to="/admin/ratings">
              <Card className={styles.actionCard} hover>
                <FiStar className={styles.actionIcon} />
                <h3>View Ratings</h3>
                <p>See all student feedback</p>
              </Card>
            </Link>
            <Link to="/admin/students">
              <Card className={styles.actionCard} hover>
                <FiUsers className={styles.actionIcon} />
                <h3>Manage Students</h3>
                <p>View registered students</p>
              </Card>
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Recent Ratings</h2>
            <Link to="/admin/ratings" className={styles.viewAll}>
              View All →
            </Link>
          </div>
          <Card className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Meal</th>
                  <th>Rating</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentRatings.map((rating) => (
                  <tr key={rating.id}>
                    <td>{rating.student}</td>
                    <td className={styles.mealType}>{rating.mealType}</td>
                    <td>
                      <span className={styles.ratingBadge}>
                        ⭐ {rating.rating}
                      </span>
                    </td>
                    <td className={styles.time}>{rating.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
