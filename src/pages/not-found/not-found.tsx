import { useNavigate } from "react-router-dom";

import { Button, Helmet, Placeholder } from "@/shared/ui";
import { ERoutePath } from "@/app/routes/types";

import styles from "./styles.module.scss";

const TITLE = "404 - Page not found";
const DESCRIPTION = "The requested page does not exist";

function NotFound() {
  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate(ERoutePath.ROOT);
  };

  return (
    <div className={styles.root}>
      <Helmet title={TITLE} description={DESCRIPTION} />

      <Placeholder
        variant="not-found"
        title={TITLE}
        description={DESCRIPTION}
        action={
          <Button variant="outline" onClick={handleGoToHome}>
            Go to home
          </Button>
        }
      />
    </div>
  );
}

export default NotFound;
