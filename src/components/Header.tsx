import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full bg-[#56aaf4] text-white shadow-md">
      <nav className="flex items-center justify-between py-4 px-6 lg:px-8">
        {/* Logo and Site Title (Home Link) */}
        <Link
          href="/"
          className="group flex items-center space-x-2"
        >
          <Image
            src="/logoWhite.png"
            alt="Dish Detective Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-2xl font-bold text-white group-hover:text-gray-200">
            Dish Detective
          </span>
        </Link>

        {/* Right-side controls */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Translate Button */}
          <button
            type="button"
            aria-label="Translate"
            className="rounded-full p-1 hover:bg-[#4a9de0]"
          >
            <Image
              src="/translate.png"
              alt="Translate"
              width={24}
              height={24}
              className="h-6 w-6 invert"
            />
          </button>

          {/* Log out button */}
          <button
            type="button"
            className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700"
          >
            Log out
          </button>
        </div>
      </nav>
    </header>
  );
}