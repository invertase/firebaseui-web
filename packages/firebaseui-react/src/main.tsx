import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider, LoginForm } from "./index";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const app = initializeApp({
  apiKey: "AIzaSyD6BMzm6VxjlpmJ6WU18uX3klJq6oYwyKs",
  authDomain: "firegraphql-testing.firebaseapp.com",
  databaseURL:
    "https://firegraphql-testing-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "firegraphql-testing",
  storageBucket: "firegraphql-testing.appspot.com",
  messagingSenderId: "76271191609",
  appId: "1:76271191609:web:01f6add2f403ccdf592fe8",
});

const auth = getAuth(app);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider auth={auth}>
      <LoginForm />
    </Provider>
  </StrictMode>
);
