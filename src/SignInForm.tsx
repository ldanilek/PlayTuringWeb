import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { SignInMethodDivider } from "./components/SignInMethodDivider";

export function SignInForm() {
  const [step, setStep] = useState<"signIn" | "linkSent">("signIn");

  return (
    <div className="container my-auto">
      <div className="max-w-[384px] mx-auto flex flex-col my-auto gap-4 pb-8">
        {step === "signIn" ? (
          <>
            <h2 className="font-semibold text-2xl tracking-tight">
              Sign in or create an account
            </h2>
            <SignInWithGitHub />
            <SignInMethodDivider />
            <SignInFormAnonymous />
          </>
        ) : (
          <>
            <h2 className="font-semibold text-2xl tracking-tight">
              Check your email
            </h2>
            <p>A sign-in link has been sent to your email address.</p>
            <Button
              className="p-0 self-start"
              variant="link"
              onClick={() => setStep("signIn")}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export function SignInWithGitHub() {
  const { signIn } = useAuthActions();
  return (
    <Button
      className="flex-1"
      variant="outline"
      type="button"
      onClick={() => void signIn("github")}
    >
      <GitHubLogoIcon className="mr-2 h-4 w-4" /> GitHub
    </Button>
  );
}

export function SignInFormAnonymous() {
  const { signIn } = useAuthActions();
  return (
    <div className="max-w-[384px] mx-auto flex flex-col gap-4">
      <>
        <Button
          type="submit"
          onClick={() => {
            void signIn("anonymous");
          }}
        >
          Start a guest session
        </Button>
      </>
    </div>
  );
}