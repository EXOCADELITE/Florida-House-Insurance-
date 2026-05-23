import { SignIn } from "@clerk/tanstack-react-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/layout/AuthShell";

export const Route = createFileRoute("/auth/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Sign in - Florida HomeShield" }] }),
});

function Login() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in with Google, Apple, or your email to view saved reports."
      footer={
        <p>
          Don't have an account?{" "}
          <Link to="/auth/signup" className="text-orange font-medium hover:underline">
            Create one
          </Link>
        </p>
      }
    >
      <div className="flex justify-center">
        <SignIn
          signUpUrl="/auth/signup"
          appearance={{
            elements: {
              rootBox: "w-full",
              cardBox: "w-full shadow-none",
              card: "w-full border border-border bg-card text-card-foreground shadow-none",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "border-border bg-background text-foreground hover:bg-secondary",
              formButtonPrimary: "bg-orange text-white hover:bg-orange/90",
              footerActionLink: "text-orange hover:text-orange/90",
            },
          }}
        />
      </div>
    </AuthShell>
  );
}
