import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to the BLIEVE portal — admin and member access for the Entrepreneurship Cell of ACET, Bengaluru.",
};

export default function LoginPage() {
  return <LoginClient />;
}
