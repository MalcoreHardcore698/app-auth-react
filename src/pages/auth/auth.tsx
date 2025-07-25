import { useCallback, useState } from "react";
import { motion } from "framer-motion";

import { LoginForm } from "@/features/auth/login-form";
import { RegisterForm } from "@/features/auth/register-form";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";
import { Helmet, Button } from "@/shared/ui";

import styles from "./styles.module.scss";

enum EAuthMode {
  LOGIN = "login",
  REGISTER = "register",
  FORGOT_PASSWORD = "forgot-password",
}

type TAuthTexts = {
  title: string;
  subtitle: string;
  footerButton: string;
};

function getAuthTexts(mode: EAuthMode): TAuthTexts {
  switch (mode) {
    case EAuthMode.LOGIN:
      return {
        title: "Login",
        subtitle: "Enter your account to continue",
        footerButton: "Don't have an account? Register",
      } as const;
    case EAuthMode.FORGOT_PASSWORD:
      return {
        title: "Forgot password?",
        subtitle: "Enter your email to reset your password",
        footerButton: "Back to login",
      } as const;
    case EAuthMode.REGISTER:
    default:
      return {
        title: "Register",
        subtitle: "Create a new account to start working",
        footerButton: "Already have an account? Login",
      } as const;
  }
}

function AuthPage() {
  const [mode, setMode] = useState<EAuthMode>(EAuthMode.LOGIN);

  const { title, subtitle, footerButton } = getAuthTexts(mode);

  const rootMotionProps = {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -150 },
    transition: { duration: 0.5 },
  };

  const opacityMotionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  };

  const toggleMode = () => {
    const isLogin = mode === EAuthMode.LOGIN;

    setMode(isLogin ? EAuthMode.REGISTER : EAuthMode.LOGIN);
  };

  const renderForm = useCallback(() => {
    switch (mode) {
      case EAuthMode.LOGIN:
        return (
          <LoginForm
            onForgotPassword={() => setMode(EAuthMode.FORGOT_PASSWORD)}
          />
        );
      case EAuthMode.REGISTER:
        return <RegisterForm />;
      case EAuthMode.FORGOT_PASSWORD:
        return <ForgotPasswordForm />;
      default:
        return null;
    }
  }, [mode]);

  return (
    <div className={styles.root}>
      <Helmet
        type="website"
        title={title}
        description={`${subtitle}. Secure authentication for React applications.`}
        keywords={`${mode}, authentication, login, register, password reset, security`}
        noIndex={true}
      />

      <motion.div key={mode} {...rootMotionProps} className={styles.container}>
        <header className={styles.header}>
          <motion.h1 {...opacityMotionProps} className={styles.title}>
            {title}
          </motion.h1>

          <motion.p {...opacityMotionProps} className={styles.subtitle}>
            {subtitle}
          </motion.p>
        </header>

        <div className={styles.form}>{renderForm()}</div>

        <footer className={styles.footer}>
          <Button
            type="button"
            variant="ghost"
            className={styles.toggleButton}
            onClick={toggleMode}
          >
            {footerButton}
          </Button>
        </footer>
      </motion.div>
    </div>
  );
}

export default AuthPage;
