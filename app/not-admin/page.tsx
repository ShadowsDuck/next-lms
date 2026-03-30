import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotAdminPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto rounded-full p-4 w-fit bg-destructive/10 mb-2">
            <ShieldX className="size-16 text-destructive" />
          </div>

          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription className="text-balance">
            Hey! You are not an admin, which means you cannot create any course
            or stuff like that...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/"
            className={buttonVariants({ className: "w-full", size: "lg" })}
          >
            <ArrowLeft className="size-4 mr-1" />
            Back to Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
