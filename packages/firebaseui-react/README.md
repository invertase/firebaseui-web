## Authentication Flows: 
  Email / password sign-in
  Email link sign-in / registration 
  Phone authentication / one-time-password 
  Email / password registration 
  OAuth provider sign-in / registration
  Password recovery

# Email / password sign-in 

<SignInAuthScreen />

<SignInAuthScreen>
  <GoogleSignInButton />
</SignInAuthScreen>

# Email link sign-in / registration 

<EmailLinkAuthScreen />

<EmailLinkAuthScreen>
  <GoogleSignInButton />
</EmailLinkAuthScreen>
# Phone authentication / one-time-password 

<PhoneAuthScreen />

Needs to handle "sent" state and switch to OTP code view

# Email / password registration 

<SignUpAuthScreen /> / <RegisterAuthScreen />

<SignUpAuthScreen>
  <GoogleSignInButton />
</SignUpAuthScreen>

# OAuth provider sign-in / registration

<OAuthAuthScreen>
  <GoogleSignInButton />
  <AppleSignInButton />
  <FacebookSignInButton />
  <TwitterSignInButton />
  <GithubSignInButton />
  <MicrosoftSignInButton />
</OAuthAuthScreen>

# Password recovery

<PasswordResetScreen />  / <ForgotPasswordScreen />



