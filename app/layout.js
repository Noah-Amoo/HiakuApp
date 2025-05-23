import "./globals.css";
import Header from "@/components/Header";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container mx-auto my-10">
          {children}
        </main>
        <footer className="text-gray-400 text-center text-xs py-5">
          <p>Copyright &copy; {new Date().getFullYear()} - All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
