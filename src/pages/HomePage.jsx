import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BatteryCharging,
  Cpu,
  BarChart,
  MapPin,
  BatteryWarning,
  PowerOff,
  TrendingUp,
  Zap,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

import HomepageHeader from '@/components/Homepage/HomepageHeader';
import Footer from '@/components/Homepage/Footer';
import Section from '@/components/Homepage/Section';
import AnimatedCounter from '@/components/Homepage/AnimatedCounter';
import PWABanner from '@/components/PWA/PWABanner.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const HomePage = () => {
  const [isUserView, setIsUserView] = useState(true);
  const { ref: partnersRef, controls: partnersControls, animationVariants: partnersVariants } = useScrollAnimation(0.2);
  const { ref: testimonialsRef, controls: testimonialsControls, animationVariants: testimonialsVariants } = useScrollAnimation(0.2);

  const howItWorksSteps = [
    {
      icon: <BatteryCharging className="w-12 h-12 text-blue-600" />,
      title: 'Connect Device',
      description: 'Easily integrate your battery hardware with our platform for instant data streaming.',
    },
    {
      icon: <BarChart className="w-12 h-12 text-blue-600" />,
      title: 'Monitor Performance',
      description: 'Access real-time analytics, health scores, and performance metrics from anywhere.',
    },
    {
      icon: <Cpu className="w-12 h-12 text-blue-600" />,
      title: 'Optimize Operations',
      description: 'Use predictive insights and remote controls to maximize battery life and efficiency.',
    },
  ];

  const techFeatures = [
    { icon: <MapPin />, title: 'Real-time GPS Tracking' },
    { icon: <TrendingUp />, title: 'Battery Health Analytics' },
    { icon: <PowerOff />, title: 'Remote Cut-Off' },
    { icon: <BatteryWarning />, title: 'Predictive Maintenance' },
    { icon: <Zap />, title: 'State of Charge Monitoring' },
    { icon: <ShieldCheck />, title: 'Secure & Scalable' },
  ];

  const partnerLogos = [
    'TechCorp', 'Innovate Inc.', 'Future Systems', 'EcoPower', 'Volt Solutions'
  ];

  const testimonials = [
    {
      quote: "This BMS has revolutionized how we manage our EV fleet. The predictive maintenance feature alone has saved us thousands in potential downtime.",
      author: "John Doe",
      title: "Fleet Manager, Eco-Charge"
    },
    {
      quote: "The level of detail in the analytics is unparalleled. We can now optimize our energy storage systems with incredible precision.",
      author: "Jane Smith",
      title: "Operations Head, PowerGrid Inc."
    },
    {
      quote: "Seamless integration and a user-friendly dashboard. Our team was up and running in hours, not days.",
      author: "Samuel Green",
      title: "CTO, NextGen Robotics"
    }
  ];

  return (
    <div className="bg-white text-gray-800">
      <Helmet>
        <title>BMS - Powering Smarter Batteries. Smarter Businesses.</title>
        <meta name="description" content="A modern Battery Management System for real-time monitoring, analytics, and optimization. Perfect for EV fleets, energy storage, and more." />
      </Helmet>
      <HomepageHeader />

      <main>
        <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-100/50 rounded-full opacity-50"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 bg-blue-50 rounded-full opacity-50"
            />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900"
            >
              Powering Smarter Batteries.
              <br />
              <span className="electric-blue-bg-gradient text-transparent bg-clip-text">Smarter Businesses.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600"
            >
              Our intelligent Battery Management System provides real-time monitoring, predictive analytics, and remote control to maximize the performance and lifespan of your batteries.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10"
            >
              <Button asChild size="lg" className="electric-blue-bg-gradient text-white font-bold text-lg px-8 py-6">
                <Link to="/login">Get Started <ChevronRight className="ml-2" /></Link>
              </Button>
            </motion.div>
          </div>
        </div>

        <Section id="solutions" className="bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
              <p className="mt-4 text-lg text-gray-600">A simple, three-step process to unlock your battery's full potential.</p>
            </div>
            <div className="mt-16 grid md:grid-cols-3 gap-12 text-center">
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="technology" className="relative">
          <div className="absolute inset-0 bg-gray-900 opacity-5"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold">Our Technology</h2>
              <p className="mt-4 text-lg text-gray-600">Packed with features to give you complete control and insight.</p>
            </div>
            <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {techFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">{React.cloneElement(feature.icon, { className: 'w-6 h-6 text-blue-600' })}</div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="dashboard-preview" className="bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold">Intuitive Dashboard</h2>
              <p className="mt-4 text-lg text-gray-600">All your battery data, beautifully visualized.</p>
              <div className="mt-8 flex items-center justify-center space-x-2">
                <Label htmlFor="view-toggle" className={!isUserView ? 'font-bold' : ''}>Admin View</Label>
                <Switch id="view-toggle" checked={isUserView} onCheckedChange={() => setIsUserView(!isUserView)} />
                <Label htmlFor="view-toggle" className={isUserView ? 'font-bold' : ''}>User View</Label>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mt-10 relative bg-white rounded-xl shadow-2xl overflow-hidden"
              style={{ minHeight: 500 }}
            >
              <div className="absolute inset-0 overflow-auto" style={{ maxHeight: 600 }}>
                <AnimatePresence>
                  <motion.div
                    key={isUserView ? 'user' : 'admin'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isUserView ? (
                      <UserDashboard
                        demo
                        sampleUser={{ id: 2, name: 'User', email: 'user@bms.com', role: 'user' }}
                        sampleBatteries={[
                          { id: 'BAT001', voltage: 12.4, temperature: 25, health: 95, status: 'online', location: 'New York, NY', cycleCount: 245 },
                          { id: 'BAT002', voltage: 11.8, temperature: 27, health: 90, status: 'offline', location: 'San Francisco, CA', cycleCount: 180 }
                        ]}
                        sampleAlerts={[
                          { id: 1, message: 'Voltage drop detected', severity: 'critical' },
                          { id: 2, message: 'Temperature high', severity: 'warning' }
                        ]}
                      />
                    ) : (
                      <AdminDashboard
                        demo
                        sampleUsers={[
                          { id: 1, name: 'Admin User', email: 'admin@bms.com', role: 'admin' },
                          { id: 2, name: 'User', email: 'user@bms.com', role: 'user' }
                        ]}
                        sampleBatteries={[
                          { id: 'BAT001', voltage: 12.4, temperature: 25, health: 95, status: 'online', location: 'New York, NY', cycleCount: 245 },
                          { id: 'BAT002', voltage: 11.8, temperature: 27, health: 90, status: 'offline', location: 'San Francisco, CA', cycleCount: 180 }
                        ]}
                        sampleAlerts={[
                          { id: 1, message: 'Voltage drop detected', severity: 'critical' },
                          { id: 2, message: 'Temperature high', severity: 'warning' }
                        ]}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </Section>

        <Section id="partners">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-gray-900">Trusted by Industry Leaders</h2>
            <motion.div
              ref={partnersRef}
              initial="hidden"
              animate={partnersControls}
              variants={partnersVariants}
              className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-5"
            >
              {partnerLogos.map((logo, index) => (
                <motion.div
                  key={logo}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { delay: index * 0.15 } }
                  }}
                  className="flex justify-center items-center"
                >
                  <span className="text-xl font-semibold text-gray-500">{logo}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>

        <Section id="testimonials" className="bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-gray-900">What Our Clients Say</h2>
            <motion.div
              ref={testimonialsRef}
              initial="hidden"
              animate={testimonialsControls}
              variants={testimonialsVariants}
              className="mt-16 grid lg:grid-cols-3 gap-8"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, transition: { delay: index * 0.2 } }
                  }}
                >
                  <Card className="h-full flex flex-col">
                    <CardContent className="pt-6 flex-grow">
                      <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                    </CardContent>
                    <CardHeader>
                      <p className="font-bold">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.title}</p>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;