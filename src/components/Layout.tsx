import type { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Star, TrendingUp } from 'lucide-react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <TrendingUp className="brand-icon" />
            <span className="brand-text">Stock Sentiment</span>
          </div>

          <div className="navbar-links">
            <Link 
              to="/my-stocks" 
              className={`nav-link ${location.pathname === '/my-stocks' ? 'active' : ''}`}
            >
              <Star className="nav-icon" />
              My Stocks
            </Link>
            <Link 
              to="/all-stocks" 
              className={`nav-link ${location.pathname === '/all-stocks' ? 'active' : ''}`}
            >
              <TrendingUp className="nav-icon" />
              All Stocks
            </Link>
          </div>

          <div className="navbar-user">
            <span className="user-email">{user?.email}</span>
            <button onClick={handleSignOut} className="sign-out-button">
              <LogOut className="nav-icon" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
