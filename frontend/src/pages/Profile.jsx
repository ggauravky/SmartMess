import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { FiUser, FiMail, FiHash, FiEdit2 } from "react-icons/fi";
import toast from "react-hot-toast";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call would go here
      updateUser({ ...user, ...formData });
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1>My Profile</h1>
          <p>Manage your account information</p>
        </header>

        <Card className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className={styles.userInfo}>
              <h2>{user?.name || "User"}</h2>
              <p>{user?.rollNumber || "Student"}</p>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                icon={FiUser}
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon={FiMail}
                disabled
              />
              <div className={styles.formActions}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className={styles.details}>
              <div className={styles.detailItem}>
                <FiUser className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Full Name</span>
                  <span className={styles.detailValue}>{user?.name}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <FiMail className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Email Address</span>
                  <span className={styles.detailValue}>{user?.email}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <FiHash className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Roll Number</span>
                  <span className={styles.detailValue}>{user?.rollNumber}</span>
                </div>
              </div>
              <Button
                variant="outline"
                icon={FiEdit2}
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
