import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  LogOut,
  User,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/components/ui/use-toast';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/notifications');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkAsRead = async (type, id) => {
    try {
      await fetch(`http://localhost:4000/api/notifications/${type}/${id}/read`, { method: 'POST' });
      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleProfile = () => {
    toast({
      title: "👤 Profile Settings",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleSearch = () => {
    toast({
      title: "🔎 Search",
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-muted">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map(n => (
                <DropdownMenuItem key={`${n.type}-${n.id}`} onSelect={() => !n.read && handleMarkAsRead(n.type, n.id)}>
                  <div className="flex items-start space-x-3">
                    {n.type === 'alarm' ? <AlertCircle className="w-5 h-5 text-yellow-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                    <div>
                      <p className={`font-medium ${!n.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {n.type.charAt(0).toUpperCase() + n.type.slice(1)} Code: {n.code}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(n.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>}
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>
                <CheckCircle className="w-5 h-5 mr-3" />
                No new notifications
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

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