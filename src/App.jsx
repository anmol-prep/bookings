import React, { useEffect } from "react";
import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useStore } from "./store/useStore";
import AppRouter from "./routes/AppRouter";

function App() {
  const { setUser } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // This will be called when auth state is determined
      setUser(user ? { 
        uid: user.uid, 
        email: user.email 
      } : null);
    });

    return () => unsubscribe();
  }, []);

  return <AppRouter />;
}

export default App;
