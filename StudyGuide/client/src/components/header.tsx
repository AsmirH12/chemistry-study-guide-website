import { Atom } from "lucide-react";
import { Link } from "wouter";
import { Progress } from "@/components/ui/progress";

interface HeaderProps {
  progress: number;
  onMobileMenuToggle?: () => void;
}

export function Header({ progress }: HeaderProps) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-ib-primary rounded-lg flex items-center justify-center">
                  <Atom className="text-white w-4 h-4" />
                </div>
                <h1 className="text-xl font-bold text-ib-neutral-800">
                  IB Chemistry Study Guide
                </h1>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/progress">
              <div className="flex items-center space-x-2 bg-ib-neutral-100 px-3 py-2 rounded-lg cursor-pointer hover:bg-ib-neutral-200 transition-colors">
                <span className="text-sm text-ib-neutral-700">Progress:</span>
                <Progress value={progress} className="w-16 h-2" />
                <span className="text-sm font-medium text-ib-secondary">
                  {progress}%
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
