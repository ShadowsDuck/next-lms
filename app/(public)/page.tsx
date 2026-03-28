import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface featureProps {
  title: string;
  description: string;
  icon: string;
}

const features: featureProps[] = [
  {
    title: "Explore Courses",
    description: "Discover a new way to learn with our innovative platform.",
    icon: "🌐",
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
    icon: "🎮",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your learning journey with detailed analytics and insights.",
    icon: "📊",
  },
  {
    title: "Community Support",
    description:
      "Join a vibrant community of learners and instructors to share knowledge and grow together.",
    icon: "👥",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="outline">The Future of Online Education</Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Elevate Your Skills with Experience
          </h1>
          <p className="max-w-[700px] md:text-xl text-muted-foreground">
            Discover a new way to learn with our innovative platform,
            interactive lessons, Access high-quality courses anytime, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/courses"
              className={buttonVariants({ className: "w-40 h-10" })}
            >
              Explore Courses
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "outline",
                className: "w-24 h-10",
              })}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <span className="text-4xl mb-4">{feature.icon}</span>
              <CardTitle className="text-lg font-semibold">
                <p>{feature.title}</p>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
