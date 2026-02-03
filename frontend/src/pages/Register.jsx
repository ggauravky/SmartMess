import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiLock, FiArrowLeft, FiHash } from "react-icons/fi";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";
import styles from "./Auth.module.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register, isAuthenticated } = useAuth();
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
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.rollNumber.trim())
      newErrors.rollNumber = "Roll number is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Min 6 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        rollNumber: formData.rollNumber,
        password: formData.password,
      });
      toast.success("Account created successfully! 🎉");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
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
            <span className={styles.emoji}>🚀</span>
            <h1>Create Account</h1>
            <p>Join SmartMess and start rating meals</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              icon={FiUser}
              error={errors.name}
            />

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
              label="Roll Number"
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="21CS101"
              icon={FiHash}
              error={errors.rollNumber}
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

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              icon={FiLock}
              error={errors.confirmPassword}
            />

            <Button type="submit" fullWidth loading={loading} size="large">
              Create Account
            </Button>
          </form>

          <p className={styles.authFooter}>
            Already have an account?{" "}
            <Link to="/login" className={styles.authLink}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className={styles.authSide}>
        <div className={styles.authSideContent}>
          <h2>Your Voice Matters</h2>
          <p>
            Help us improve campus dining with your valuable feedback on every
            meal!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
