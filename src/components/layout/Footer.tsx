import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FacebookIcon, XIcon, InstagramIcon, LinkedInIcon, GitHubIcon, YouTubeIcon, WhatsAppIcon } from './SocialIcons';
import { Button } from '@/components/ui/button';

const productLinks = [
  { name: 'Live Map', href: '/map' },
  { name: 'Report Hazard', href: '/report' },
  { name: 'AI Intelligence', href: '/ai-intelligence' },
  { name: 'Community Health', href: '/community-health' },
];

const resourceLinks = [
  { name: 'Knowledge Centre', href: '/knowledge' },
  { name: 'Cleanup Events', href: '/community-insights' },
  { name: 'Impact Center', href: '/rewards' },
  { name: 'FAQ', href: '/faq' },
];

const companyLinks = [
  { name: 'About ECHO', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Service', href: '/terms-of-service' },
  { name: 'Cookie Policy', href: '/cookie-policy' },
  { name: 'Accessibility', href: '/accessibility' },
];

const socials = [
  { name: 'Facebook', icon: FacebookIcon, href: '#' },
  { name: 'X (Twitter)', icon: XIcon, href: '#' },
  { name: 'Instagram', icon: InstagramIcon, href: '#' },
  { name: 'LinkedIn', icon: LinkedInIcon, href: '#' },
  { name: 'GitHub', icon: GitHubIcon, href: '#' },
  { name: 'YouTube', icon: YouTubeIcon, href: '#' },
  { name: 'WhatsApp Channel', icon: WhatsAppIcon, href: '#' },
];

export function Footer() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <footer className="relative border-t border-white/10 bg-[#1B5E20]">

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* CTA banner - hidden on landing page */}
      {!isLandingPage && (
        <div className="border-b border-white/10">
          <div className="container mx-auto px-4 py-10 lg:py-12">

            <div className="
              card-premium
              flex
              flex-col
              items-center
              justify-between
              gap-6
              rounded-3xl
              bg-white/10
              backdrop-blur-xl
              p-8
              text-center
              sm:flex-row
              sm:text-left
            ">

              <div>
                <h3 className="text-xl font-black text-white sm:text-2xl">
                  Ready to make a difference?
                </h3>

                <p className="mt-1 text-sm text-white/70">
                  Join citizens across Nigeria reporting hazards and building healthier communities.
                </p>
              </div>

              <div className="flex shrink-0 gap-3">

                <Button
                  asChild
                  className="rounded-full bg-white px-6 text-[#1B5E20] hover:bg-white/90"
                >
                  <Link to="/auth/register">
                    Get Started
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-white/30 px-6 text-white hover:bg-white/10"
                >
                  <Link to="/report">
                    Report a Hazard
                  </Link>
                </Button>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* Footer Content */}
      <div className="container mx-auto px-4 py-12 lg:py-14">

        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">

          {/* Brand */}
          <div className="col-span-2 md:col-span-2">

            <Link to="/" className="inline-flex items-center gap-2">
              <img
                src="/echo-logo-primary.svg"
                alt="ECHO"
                className="h-9 w-auto"
              />

              <span className="text-lg font-black text-white">
                ECHO
              </span>
            </Link>

            <p className="mt-3 max-w-xs text-sm text-white/70">
              Environmental Community Health Observatory — AI-powered environmental intelligence for cleaner, safer communities.
            </p>


            <div className="mt-4 flex flex-wrap items-center gap-2">

              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="
                    inline-flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-white/10
                    text-white
                    transition
                    hover:bg-white/20
                  "
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}

            </div>

          </div>


          {[
            ['Features', productLinks],
            ['Resources', resourceLinks],
            ['Company', companyLinks],
            ['Legal', legalLinks],
          ].map(([title, links]) => (
            <div key={title as string}>

              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {title}
              </h4>

              <ul className="mt-3 space-y-2 text-sm">

                {(links as {name:string; href:string}[]).map((l) => (
                  <li key={l.name}>
                    <Link
                      to={l.href}
                      className="text-white/70 transition hover:text-white"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}

              </ul>

            </div>
          ))}

        </div>


        <div className="
          mt-10
          flex
          flex-col
          items-center
          justify-between
          gap-3
          border-t
          border-white/10
          pt-6
          text-xs
          text-white/60
          sm:flex-row
        ">

          <p>
            © {new Date().getFullYear()} ECHO — Environmental Community Health Observatory.
          </p>

          <p>
            Built for Nigeria 🇳🇬 · Powered by community
          </p>

        </div>

      </div>

    </footer>
  );
}
