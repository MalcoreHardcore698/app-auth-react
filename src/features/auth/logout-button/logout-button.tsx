import { Button } from "@/shared/ui";
import { useAuth } from "@/services/auth";

interface ILogoutButtonProps {
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  className?: string;
}

function LogoutButton({
  size = "medium",
  variant = "outline",
  className,
}: ILogoutButtonProps) {
  const { logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      Logout
    </Button>
  );
}

export default LogoutButton;
