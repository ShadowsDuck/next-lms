"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetti";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function PaymentSuccessPage() {
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    triggerConfetti();
  }, [triggerConfetti]);

  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="flex w-[450px] h-[300px] rounded-xl items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center">
            <Check className="size-16 p-2 bg-green-500/30 text-green-500 rounded-full" />
          </div>

          <div className="flex flex-col items-center text-center gap-2">
            <h1 className="text-2xl font-bold">Payment Success!</h1>
            <p className="text-muted-foreground mt-2 tracking-tight text-balance">
              Your payment has been processed successfully. You can now access
              your course.
            </p>
          </div>

          <Link href="/dashboard" className={buttonVariants()}>
            <ArrowLeft className="size-4" />
            Go to Dashboard
          </Link>
        </div>
      </Card>
    </div>
  );
}
