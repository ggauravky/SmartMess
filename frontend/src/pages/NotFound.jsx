import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { FiHome } from "react-icons/fi";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <span className={styles.emoji}>🍽️</span>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button icon={FiHome}>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
