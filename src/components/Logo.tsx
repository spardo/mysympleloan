import React from 'react';

export const Logo = ({ className = '' }: { className?: string }) => (
  <img 
    src="https://static.symplelending.com/images/Symple%20Lending%20All-%20White%20VECTOR.svg" 
    alt="Symple Lending"
    className={className}
  />
);