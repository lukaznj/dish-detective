"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, MenuItem, Box } from '@mui/material';

export default function Header({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (isHomepage) {
    // === HOMEPAGE HEADER ===
    return (
      <>
        <header className="absolute top-0 left-0 w-full z-50">
          <nav className="flex items-center justify-between py-4 px-6 lg:px-8">

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

            <div className="flex items-center space-x-4 md:space-x-6">
              <Link
                href="/kontakt"
                className="rounded-md bg-white px-4 py-2 text-lg font-medium text-black hover:bg-gray-200"
              >
                Kontakt
              </Link>
              
              <button
                aria-controls={open ? 'prijava-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                className="rounded-md bg-[#ff8c00] px-4 py-2 text-lg font-medium text-white hover:bg-[#f18501ff]"
              >
                Prijava
              </button>
              
              <Menu
                id="prijava-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'prijava-button',
                }}
                slotProps={{
                  paper: {
                    sx: { minWidth: 200, mt: 1, borderRadius: 2 },
                  },
                }}
              >
                <MenuItem onClick={handleClose}>
                  Radnik u menzi
                </MenuItem>
                <Box sx={{ borderBottom: "1px solid #e0e0e0", my: 0 }} />
                <MenuItem onClick={handleClose}>
                  Student
                </MenuItem>
              </Menu>
            </div>
          </nav>
        </header>

        {children}
      </>
    );
  } else {
    // === DEFAULT HEADER ===
    return (
      <>
        <header className="w-full bg-[#56aaf4] text-white shadow-md">
          <nav className="flex items-center justify-between py-4 px-6 lg:px-8">
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

            <div className="flex items-center space-x-4 md:space-x-6">
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

              <button
                type="button"
                className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700"
              >
                Odjava
              </button>
            </div>
          </nav>
        </header>

        {children}
      </>
    );
  }
}