import React from 'react';
import { Link } from 'react-router-dom';
import { Battery, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const Footer = () => {
  const handleDemoRequest = (e) => {
    e.preventDefault();
    toast({
      title: '🚀 Demo Request Sent!',
      description: "Thanks for your interest! We'll be in touch shortly.",
    });
  };

  return (
    <footer className="bg-gray-900 text-white" id="contact">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Optimize Your Batteries?
            </h2>
            <p className="text-gray-300 mb-8">
              Schedule a demo with our experts to see how our BMS can transform your operations.
            </p>
            <form onSubmit={handleDemoRequest} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                required
              />
              <Button type="submit" className="electric-blue-bg-gradient text-white font-bold">
                Schedule a Demo
              </Button>
            </form>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-bold mb-4">Solutions</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">EV Fleets</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Energy Storage</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">IoT Devices</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Battery className="w-6 h-6 text-blue-500" />
            <span className="font-bold">BMS</span>
          </div>
          <p className="text-gray-400 text-sm mb-4 sm:mb-0">
            © {new Date().getFullYear()} Battery Management System. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white"><Twitter /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Facebook /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Linkedin /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;