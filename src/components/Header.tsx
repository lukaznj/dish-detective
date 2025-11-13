import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // 1. Import next/image

export default function Header() {
  return (
    // 2. Updated header styling to be light
    <header className="w-full bg-white text-gray-900 shadow-md">
      <nav className="container mx-auto flex items-center justify-between p-4">
        {/* 3. Logo and Site Title as Home Link */}
        <Link
          href="/"
          className="group flex items-center space-x-2"
        >
          <Image
            src="/logoDark.svg" // 4. Use logo from /public folder
            alt="Dish Detective Logo"
            width={32} // Set base width
            height={32} // Set base height
            className="h-8 w-8" // Tailwind class to size
          />
          <span className="text-2xl font-bold text-gray-900 group-hover:text-gray-700">
            Dish Detective
          </span>
        </Link>

        {/* 5. Right-side controls */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Translate Button */}
          <button
            type="button"
            aria-label="Translate"
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <Image
              src="/translate.png" // 6. Use translate icon
              alt="Translate"
              width={24}
              height={24}
              className="h-6 w-6"
            />
          </button>

          {/* Login Button (matches your original styling) */}
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}