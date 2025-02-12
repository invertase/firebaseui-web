interface CustomSignInScreenProps {
  children: React.ReactNode;
  className?: string;
}

export function CustomSignInScreen({
  children,
  className,
}: CustomSignInScreenProps) {
  return <div className={`fui-screen ${className || ""}`}>{children}</div>;
}
