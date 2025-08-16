import { getMenu } from '@/lib/pgclosets';
import { Menu } from '@/lib/pgclosets/types';
import Link from 'next/link';
import { Suspense } from 'react';
import CartModal from '@/components/commerce/cart/modal';
import MobileMenu from '@/components/commerce/navbar/mobile-menu';
import Search, { SearchSkeleton } from '@/components/commerce/navbar/search';

export async function CommerceNavbar() {
  const menu = await getMenu('main-menu');

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6 bg-white border-b border-neutral-200">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                PG
              </div>
              <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
                PG Closets
              </div>
            </div>
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    prefetch={true}
                    className="text-neutral-600 underline-offset-4 hover:text-black hover:underline font-medium transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex justify-end md:w-1/3">
          <CartModal />
        </div>
      </div>
    </nav>
  );
}