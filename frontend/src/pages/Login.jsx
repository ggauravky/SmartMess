import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";
import styles from "./Auth.module.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success("Welcome back! 🎉");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <Link to="/" className={styles.backLink}>
          <FiArrowLeft /> Back to home
        </Link>

        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <span className={styles.emoji}>👋</span>
            <h1>Welcome back!</h1>
            <p>Sign in to continue to SmartMess</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              icon={FiMail}
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={FiLock}
              error={errors.password}
            />

            <Button type="submit" fullWidth loading={loading} size="large">
              Sign In
            </Button>
          </form>

          <p className={styles.authFooter}>
            Don't have an account?{" "}
            <Link to="/register" className={styles.authLink}>
              Create one
            </Link>
          </p>
        </div>
      </div>

      <div className={styles.authSide}>
        <div className={styles.authSideContent}>
          <h2>Rate. Feedback. Improve.</h2>
          <p>
            Your feedback helps us serve better meals. Join the SmartMess
            community today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
