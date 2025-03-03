import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const COMPANY_LINKS = [
  { label: 'Home', href: 'https://symplelending.com/' },
  { label: 'About Us', href: 'https://symplelending.com/about-us' },
  { label: 'Blog', href: 'https://symplelending.com/posts' }
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: 'https://symplelending.com/privacy-policy' },
  { label: 'Terms of Use', href: 'https://symplelending.com/terms-of-use' },
  { label: 'CA Privacy Policy', href: 'https://symplelending.com/california-privacy-policy' },
  { label: 'Opt Out / Data Request', href: 'https://symplelending.com/opt-out' },
  { label: 'E-Comm Consent', href: 'https://symplelending.com/esign-consent' },
  { label: 'Privacy Notice', href: 'https://symplelending.com/privacy-notice' }
];

const SOCIAL_LINKS = [
  { 
    Icon: Facebook, 
    href: 'https://www.facebook.com/symplelending/',
    label: 'Facebook'
  },
  { 
    Icon: Instagram, 
    href: 'https://www.instagram.com/symplelending/#',
    label: 'Instagram'
  },
  { 
    Icon: Twitter, 
    href: 'https://x.com/symplelend/?mx=2',
    label: 'X'
  },
  { 
    Icon: Linkedin, 
    href: 'https://www.linkedin.com/company/symple-lending/',
    label: 'LinkedIn'
  }
];

export default function Footer() {
  return (
    <footer className="bg-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Company and Social Links */}
        <div className="flex flex-col items-center space-y-8 mb-8">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {COMPANY_LINKS.map((link, index) => (
              <React.Fragment key={link.href}>
                <a 
                  href={link.href}
                  className="text-gray-600 hover:text-[#212d52] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
                {index < COMPANY_LINKS.length - 1 && (
                  <span className="text-gray-300">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex justify-center gap-4">
            {SOCIAL_LINKS.map(({ Icon, href, label }) => (
              <a
                key={href}
                href={href}
                className="w-8 h-8 bg-[#212d52] text-white rounded-full flex items-center justify-center hover:bg-[#1a2441] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-8">
          {LEGAL_LINKS.map((link, index) => (
            <React.Fragment key={link.href}>
              <a 
                href={link.href}
                className="text-sm text-gray-500 hover:text-[#212d52] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
              {index < LEGAL_LINKS.length - 1 && (
                <span className="text-gray-300">|</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Disclosure */}
        <div className="text-sm text-gray-500 max-w-4xl mx-auto text-center mb-8">
          <p className="mb-4">
            Symple Lending, LLC is a Utah licensed lender under the Utah Department of Financial Institutions. Personal loan offers provided to customers who originated via a paid Google or Bing advertisement feature rate quotes on Symple Lending of no greater than 35.99% APR with terms from 61 days to 180 months. Your actual rate depends upon credit score, loan amount, loan term, domicile and credit usage and history, and will be agreed upon between you and the lender.
          </p>
          <p>
            An example of total amount paid on a personal loan of $10,000 for a term of 36 months at a rate of 10% would be equivalent to $11,616.12 over the 36 month life of the loan.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-500 text-center">
          Copyright © {new Date().getFullYear()} Symple Lending, LLC.
        </div>
      </div>
    </footer>
  );
}