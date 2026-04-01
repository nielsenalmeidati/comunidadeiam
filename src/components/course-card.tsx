import Link from "next/link";
import Image from "next/image";
import { Clock, BookOpen, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Course } from "@/lib/mock-data";

export function CourseCard({ course }: { course: Course }) {
  const progress = course.totalLessons > 0
    ? Math.round((course.completedLessons / course.totalLessons) * 100)
    : 0;

  return (
    <Link href={`/cursos/${course.slug}`}>
      <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10">
        {/* Thumbnail */}
        <div className="relative h-44 overflow-hidden bg-secondary">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute top-3 left-3 bg-primary/90 text-white border-0 text-xs">
            {course.category}
          </Badge>
          {progress === 100 && (
            <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {course.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {course.totalLessons} aulas
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {course.duration}
            </span>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">
                {course.completedLessons}/{course.totalLessons} concluídas
              </span>
              <span className={progress > 0 ? "text-primary font-medium" : "text-muted-foreground"}>
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
