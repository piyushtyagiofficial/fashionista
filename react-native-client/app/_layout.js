import React from "react";
import Navigation from "./Navigation";
import { AuthProvider } from "../AuthContext";

export default function App() {
  return (
    <AuthProvider>
        <Navigation />
    </AuthProvider>
  );
}
