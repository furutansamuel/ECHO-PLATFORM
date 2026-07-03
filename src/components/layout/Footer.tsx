import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';

const productLinks = [
  { name: 'Features', href: '/dashboard' },
  { name: 'Live Map', href: '/map' },
  { name: 'Report Hazard', href: '/report' },
  { name: 'AI Intelligence', href: '/ai-intelligence' },
  { name: 'Community Health', href: '/community-health' },
];

const resourceLinks = [
  { name: 'Knowledge Centre', href: '/knowledge' },
  { name: 'Cleanup Events', href: '/community-insights' },
  { name: 'Impact Center', href: '/rewards' },
  { name: 'Community Insights', href: '/community-insights' },
];

const legalLinks = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Privacy Policy', href: '/' },
  { name: 'Terms of Service', href: '/' },
];

const socialLinks = [
  { name: 'Facebook', href: '#', icon: 'facebook' },
  { name: 'Twitter', href: '#', icon: 'twitter' },
  { name: 'Instagram', href: '#', icon: 'instagram' },
  { name: 'LinkedIn', href: '#', icon: 'linkedin' },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand and CTA */}
          <div className="lg:col-span-4 space-y-4 pr-8">
            <Link to="/" className="flex items-center gap-2">
                <Icons.logo className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl tracking-tight text-white">ECHO</span>
            </Link>
            <p className="text-gray-400 text-sm">
              A community-powered platform for a cleaner, safer Nigeria. Report environmental hazards, track progress, and join a network of citizens dedicated to creating resilient communities.
            </p>
            <form className="pt-2 space-y-2" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="newsletter" className="text-sm font-medium">Stay updated on our progress</label>
                <div className="flex items-center gap-2">
                    <Input id="newsletter" type="email" placeholder="Enter your email" className="bg-gray-800 border-gray-700 text-white"/>
                    <Button type="submit" variant="secondary">Subscribe</Button>
                </div>
            </form>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:col-span-8 gap-8 lg:pl-10">
            <div>
              <h4 className="font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                {productLinks.map((link) => (
                  <li key={link.name}><Link to={link.href} className="hover:text-white transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                {resourceLinks.map((link) => (
                  <li key={link.name}><Link to={link.href} className="hover:text-white transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                {legalLinks.map((link) => (
                  <li key={link.name}><Link to={link.href} className="hover:text-white transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} ECHO. Premium Civic Technology for Nigeria.
          </p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            {socialLinks.map((link) => {
              // Map icon name to Lucide or Icons
              const Icon = Icons[link.icon as keyof typeof Icons] || Icons.logo;
              return (
                <Link key={link.name} to={link.href} className="text-gray-500 hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
