import { motion } from "framer-motion";

import { useAuth } from "@/services/auth";
import { LogoutButton } from "@/features/auth/logout-button";
import { Loader, Placeholder, Helmet } from "@/shared/ui";

import styles from "./styles.module.scss";

function WelcomePage() {
  const { user, isLoading } = useAuth();

  const rootMotionProps = {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -150 },
    transition: { duration: 0.5 },
  };

  if (isLoading) {
    return <Loader.FullScreen />;
  }

  if (!user) {
    return (
      <div className={styles.root}>
        <div className={styles.container}>
          <Placeholder
            variant="error"
            title="User not found"
            description="Please try to log in again"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <Helmet
        type="website"
        title="Welcome"
        description="Welcome to your secure dashboard. Manage your account and access your personalized content."
        keywords="dashboard, welcome, user profile, account management"
      />

      <motion.div {...rootMotionProps} className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome, {user.name}!</h1>
          <p className={styles.subtitle}>Glad to see you again</p>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <div className={styles.avatarText}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.field}>
              <span className={styles.label}>Name:</span>
              <span className={styles.value}>
                {user.name || "Not specified"}
              </span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>
                {user.email || "Not specified"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <LogoutButton variant="danger" size="medium" />
        </div>
      </motion.div>
    </div>
  );
}

export default WelcomePage;
