"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function VerifyRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;

  const [otp, setOtp] = useState("");
  const [isEmailPending, startEmailTransition] = useTransition();

  const isOtpCompleted = otp.length === 6;

  function verifyOTP() {
    startEmailTransition(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified successfully");
            router.push("/");
          },
          onError: () => {
            toast.error("Error verifying email, try again");
          },
        },
      });
    });
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Please check your email</CardTitle>
        <CardDescription>
          We have sent an OTP to your email address. Please enter it below to
          verify your email.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-col items-center space-y-2">
          <InputOTP
            value={otp}
            onChange={(value) => setOtp(value)}
            maxLength={6}
            className="gap-2"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit OTP sent to your email address.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={verifyOTP}
          disabled={isEmailPending || !isOtpCompleted}
          className="w-full"
        >
          {isEmailPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            "Verify Account"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
