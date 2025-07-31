import React from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/components/ui/use-toast';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSearch = () => {
    toast({
      title: "🔍 Search Feature",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleNotifications = () => {
    toast({
      title: "🔔 Notifications",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleProfile = () => {
    toast({
      title: "👤 Profile Settings",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-card border-b border-border px-4 py-3 flex items-center justify-between"
    >
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="hidden md:flex items-center space-x-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search batteries, users, alerts..."
              className="pl-10"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="relative"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNotifications}
          className="relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            3
          </span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleProfile}
        >
          <User className="w-5 h-5" />
        </Button>

        <div className="hidden sm:flex items-center space-x-3 pl-3 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}