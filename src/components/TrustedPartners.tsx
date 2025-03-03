import React from 'react';
import Marquee from 'react-fast-marquee';

const PARTNERS = [
  {
    name: 'Achieve',
    logo: 'https://static.symplelending.com/images/partners/achieve.svg'
  },
  {
    name: 'Upgrade',
    logo: 'https://static.symplelending.com/images/partners/upgrade.svg'
  },
  {
    name: 'SoFi',
    logo: 'https://static.symplelending.com/images/partners/sofi.svg'
  },
  {
    name: 'OneMain Financial',
    logo: 'https://static.symplelending.com/images/partners/onemain.svg'
  },
  {
    name: 'Chime',
    logo: 'https://static.symplelending.com/images/partners/chime.svg'
  },
  {
    name: 'Reach',
    logo: 'https://static.symplelending.com/images/partners/reach.svg'
  },
  {
    name: 'LendingClub',
    logo: 'https://static.symplelending.com/images/partners/lendingclub.svg'
  },
  {
    name: 'Splash',
    logo: 'https://static.symplelending.com/images/partners/splash.svg'
  },
  {
    name: 'Upstart',
    logo: 'https://static.symplelending.com/images/partners/upstart.svg'
  },
  {
    name: 'Best Egg',
    logo: 'https://static.symplelending.com/images/partners/bestegg.svg'
  }
];

export default function TrustedPartners() {
  return (
    <div className="w-full overflow-hidden py-8">
        <h3 className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-8">
          Our Trusted Lending Partners
        </h3>
        
        <div className="relative" style={{ height: '32px' }}>
          <Marquee
            speed={40}
            gradient={false}
            pauseOnHover={true}
          >
            {PARTNERS.map((partner) => (
              <div 
                key={partner.name}
                className="mx-8 transition-opacity duration-300 grayscale hover:grayscale-0"
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="h-8 w-auto object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </Marquee>
        </div>
    </div>
  );
}