import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  to: string;
  className?: string;
  children: React.ReactNode;
}

const SmoothScrollLink: React.FC<Props> = ({ to, className, children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const hash = to.startsWith('#') ? to : '';
    if (location.pathname !== '/') {
      navigate('/' + hash);
    } else {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <a href={to} className={className} onClick={handleClick}>
      {children}
    </a>
  );
};

export default SmoothScrollLink;
