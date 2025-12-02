import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Water Dispenser - Dashboard',
  description: 'Monitor your water dispenser and flow sensor metrics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <div className="app-container">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
