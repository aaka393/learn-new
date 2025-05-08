import React from 'react';
import NavMenu from './NavMenu';
import Footer from './Footer';
import ErrorBoundary from '../common/ErrorBoundary';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavMenu />
      <main className="flex-grow">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;