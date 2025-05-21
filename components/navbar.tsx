'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getCurrentUser } from '@/lib/actions/auth-actions';
import logo from '/public/Assets/logo.png';
import Image from 'next/image';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  type User = {
    role?: string;
    [key: string]: any;
  };

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    getUser();
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Link
            href='/'
            className='flex items-center'
          >
            
            <span className='text-2xl font-bold text-primary'>ImpactLab</span>

        <Image src={logo} alt="ImpactLab Logo" width={50} style={{ height: 'auto' }} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-6'>
          <Link
            href='/'
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              isActive('/') ? 'text-primary' : 'text-foreground/60'
            )}
          >
            Home
          </Link>
          <Link
            href='/rooms'
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              isActive('/rooms') ? 'text-primary' : 'text-foreground/60'
            )}
          >
            Rooms
          </Link>
          <Link
            href='/contact'
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              isActive('/contact') ? 'text-primary' : 'text-foreground/60'
            )}
          >
            Contact
          </Link>
          {user?.role === 'admin' && (
            <Link
              href='/admin'
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname.startsWith('/admin')
                  ? 'text-primary'
                  : 'text-foreground/60'
              )}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className='hidden md:flex items-center gap-4'>
          {user ? (
            <div className='flex items-center gap-4'>
              <Link href='/profile'>
                <Button
                  variant='ghost'
                  className='text-sm font-medium'
                >
                  My Profile
                </Button>
              </Link>
              <Link href='/logout'>
                <Button
                  variant='outline'
                  className='text-sm font-medium'
                >
                  Logout
                </Button>
              </Link>
            </div>
          ) : (
            <div className='flex items-center gap-4'>
              <Link href='/login'>
                <Button
                  variant='ghost'
                  className='text-sm font-medium'
                >
                  Login
                </Button>
              </Link>
              <Link href='/register'>
                <Button
                  variant='default'
                  className='text-sm font-medium'
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden flex items-center'
          onClick={toggleMenu}
          aria-label='Toggle menu'
        >
          {isMenuOpen ? (
            <X className='h-6 w-6' />
          ) : (
            <Menu className='h-6 w-6' />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='md:hidden container py-4 border-t'>
          <nav className='flex flex-col space-y-4'>
            <Link
              href='/'
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                isActive('/') ? 'text-primary' : 'text-foreground/60'
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href='/rooms'
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                isActive('/rooms') ? 'text-primary' : 'text-foreground/60'
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Rooms
            </Link>
            <Link
              href='/contact'
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                isActive('/contact') ? 'text-primary' : 'text-foreground/60'
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {user?.role === 'admin' && (
              <Link
                href='/admin'
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname.startsWith('/admin')
                    ? 'text-primary'
                    : 'text-foreground/60'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className='pt-4 border-t'>
              {user ? (
                <div className='flex flex-col space-y-4'>
                  <Link
                    href='/profile'
                    className='text-sm font-medium'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href='/logout'
                    className='text-sm font-medium'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Logout
                  </Link>
                </div>
              ) : (
                <div className='flex flex-col space-y-4'>
                  <Link
                    href='/login'
                    className='text-sm font-medium'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href='/register'
                    className='text-sm font-medium'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
