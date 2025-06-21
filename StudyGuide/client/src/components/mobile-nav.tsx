import { Home, Book, CircleHelp, TrendingUp } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Book, label: "Topics", href: "/topics" },
    { icon: CircleHelp, label: "Quiz", href: "/quiz" },
    { icon: TrendingUp, label: "Progress", href: "/progress" }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-colors cursor-pointer",
                isActive ? "text-ib-primary" : "text-gray-400"
              )}>
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
