import cn from "classnames";

import styles from "./styles.module.scss";

export interface ILoaderProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "white";
  className?: string;
}

function Loader({
  size = "medium",
  color = "primary",
  className,
}: ILoaderProps) {
  const rootClassName = cn(
    styles.root,
    styles[`size__${size}`],
    styles[`color__${color}`],
    className
  );

  return (
    <div className={rootClassName}>
      <div className={styles.spinner} />
    </div>
  );
}

function FullScreenLoader() {
  return (
    <div className={styles.fullScreenLoader}>
      <Loader />
    </div>
  );
}

Loader.FullScreen = FullScreenLoader;

export default Loader;
