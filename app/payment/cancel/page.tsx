import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, XIcon } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="flex w-[450px] h-[250px] rounded-xl items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center">
            <XIcon className="size-16 p-2 bg-red-500/30 text-red-500 rounded-full" />
          </div>

          <div className="flex flex-col items-center text-center gap-2">
            <h1 className="text-2xl font-bold">Payment Cancelled</h1>
            <p className="text-muted-foreground mt-2 tracking-tight text-balance">
              Your payment has been cancelled. Please try again later.
            </p>
          </div>

          <Link href="/" className={buttonVariants()}>
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </div>
      </Card>
    </div>
  );
}
