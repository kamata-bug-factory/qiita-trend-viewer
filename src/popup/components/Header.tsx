import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw } from "lucide-react";

interface HeaderProps {
  onRefresh: () => void;
  onLogout: () => void;
}

export function Header({ onRefresh, onLogout }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3">
      <h1 className="text-sm font-bold tracking-tight">Qiita Trend</h1>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onRefresh}
          aria-label="Refresh"
        >
          <RefreshCw className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onLogout}
          aria-label="Logout"
        >
          <LogOut className="size-3.5" />
        </Button>
      </div>
    </header>
  );
}
