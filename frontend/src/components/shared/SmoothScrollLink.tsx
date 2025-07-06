// src/components/shared/SmoothScrollLink.tsx
import { useNavigate, useLocation } from 'react-router-dom';

interface SmoothScrollLinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const SmoothScrollLink = ({ to, className, children, onClick }: SmoothScrollLinkProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const hash = to.includes('#') ? to.split('#')[1] : '';
    const isHome = location.pathname === '/';

    if (!isHome) {
      navigate(`/#${hash}`);
    } else {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }

    onClick?.();
  };

  return (
    <a href={to} className={className} onClick={handleClick}>
      {children}
    </a>
  );
};

export default SmoothScrollLink;
