import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-gray-900 text-white shadow-md">
      <nav className="container mx-auto flex items-center justify-between p-4">
        {/* Logo or Site Title */}
        <a
          href="/"
          className="text-2xl font-bold text-white hover:text-gray-300"
        >
          DISH-DETECTIVE
        </a>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <a href="/" className="text-lg hover:text-gray-300">
            Home
          </a>
          <a href="/about" className="text-lg hover:text-gray-300">
            About
          </a>
          <a href="/contact" className="text-lg hover:text-gray-300">
            Contact
          </a>

          {/* Call-to-Action Button */}
          <a
            href="/login"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Login
          </a>
        </div>
      </nav>
    </header>
  );
}