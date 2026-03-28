"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignOut } from "@/hooks/use-signout";
import { BookOpen, Home, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";

interface iAppProps {
  name: string;
  email: string;
  image: string;
}

export default function UserDropdown({ name, email, image }: iAppProps) {
  const handleSignOut = useSignOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2">
        <Avatar>
          <AvatarImage src={image} alt="Profile" />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-48">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {name}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/">
            <Home size={16} className="opacity-60" aria-hidden />
            <span>Home</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/courses">
            <BookOpen size={16} className="opacity-60" aria-hidden />
            <span>Courses</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard size={16} className="opacity-60" aria-hidden />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut size={16} className="opacity-60" aria-hidden />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
