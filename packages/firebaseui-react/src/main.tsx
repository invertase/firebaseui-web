import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { SignInForm } from './auth/sign-in-form'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SignInForm />
  </StrictMode>,
)

// SignInScreen = full page
// SignIn  = Container form / card
// SignInForm = just the form

