import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'CineView - Discover. Review. Rate.',
  description: 'A simple movie review website built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        {children}
        <footer className="footer">
          <p>CineView &middot; Discover. Review. Rate.</p>
        </footer>
      </body>
    </html>
  );
}
