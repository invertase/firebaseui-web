import { cn } from "~/utils/cn";

interface CustomSignInScreenProps {
  children: React.ReactNode;
  className?: string;
}

export function CustomSignInScreen({
  children,
  className,
}: CustomSignInScreenProps) {
  return <div className={cn("fui-screen", className)}>{children}</div>;
}
