'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, Clock, Settings } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Projects',
      href: '/dashboard',
      icon: Home,
      activeMatch: ['/dashboard', '/projects'],
    },
    {
      label: 'New',
      href: '/dashboard?action=new',
      icon: PlusCircle,
      activeMatch: [],
    },
    {
      label: 'Activity',
      href: '/activity',
      icon: Clock,
      activeMatch: ['/activity'],
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings,
      activeMatch: ['/settings'],
    },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.activeMatch.length === 0) return false;
    return item.activeMatch.some((match) => pathname?.startsWith(match));
  };

  // Don't show on home page or offline page
  if (pathname === '/' || pathname === '/offline') {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full touch-target group"
            >
              <div
                className={`flex flex-col items-center justify-center transition-all duration-200 ${
                  active
                    ? 'text-blue-600 scale-110'
                    : 'text-gray-600 group-active:scale-95'
                }`}
              >
                <Icon
                  className={`h-6 w-6 transition-all ${
                    active ? 'stroke-[2.5]' : 'stroke-[2]'
                  }`}
                />
                <span
                  className={`text-xs mt-1 font-medium ${
                    active ? 'opacity-100' : 'opacity-70'
                  }`}
                >
                  {item.label}
                </span>
              </div>
              {active && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
