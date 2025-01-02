import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Restaurant Booking System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <h1 className="header">Restaurant Booking</h1>
        </nav>
        {children}
        <footer className="footer">
          &copy; 2025 Restaurant Booking System
        </footer>
      </body>
    </html>
  );
}
