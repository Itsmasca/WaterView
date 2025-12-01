import './globals.css';

export const metadata = {
  title: 'GraphQL Monitor - Dashboard',
  description: 'Monitor your GraphQL API performance and metrics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
