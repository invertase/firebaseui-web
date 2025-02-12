import { Card } from "../components/card";
import { CardHeader } from "../components/card-header";
import { CustomSignInScreen } from "./custom-sign-in-screen";
import { EmailPasswordForm } from "./email-password-form";

interface SignInScreenProps {
  onForgotPasswordClick?: () => void;
  onRegisterClick?: () => void;
}

export function SignInScreen({
  onForgotPasswordClick,
  onRegisterClick,
}: SignInScreenProps) {
  return (
    <CustomSignInScreen>
      <Card>
        <CardHeader />
        <EmailPasswordForm
          onForgotPasswordClick={onForgotPasswordClick}
          onRegisterClick={onRegisterClick}
        />
      </Card>
    </CustomSignInScreen>
  );
}
