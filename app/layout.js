import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-gray-100 shadow-md">
          <div className="container mx-auto">
          <div className="navbar shadow-sm">
            <div className="flex-1">
              <Link href='/' className="btn btn-ghost text-xl">Haiku App</Link>
            </div>
            <div className="flex-none">
              <ul className="menu menu-horizontal px-1">
                <li><a>Link</a></li>
                <li>
                  <Link href='/login'>Log In</Link>
                </li>
              </ul>
            </div>
          </div>
          </div>
        </header>
        {children}
        <footer>Footer</footer>
      </body>
    </html>
  );
}
