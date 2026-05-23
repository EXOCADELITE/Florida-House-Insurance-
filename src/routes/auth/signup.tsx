import { SignUp } from "@clerk/tanstack-react-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/layout/AuthShell";

export const Route = createFileRoute("/auth/signup")({
  component: SignUpPage,
  head: () => ({ meta: [{ title: "Create account - Florida HomeShield" }] }),
});

function SignUpPage() {
  return (
    <AuthShell
      title="Create your homeowner account"
      subtitle="Sign up with Google, Apple, or your email. Free to start."
      footer={
        <p>
          Already have an account?{" "}
          <Link to="/auth/login" className="text-orange font-medium hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <div className="flex justify-center">
        <SignUp
          signInUrl="/auth/login"
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
