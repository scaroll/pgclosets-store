'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Form from 'next/form';
import { useSearchParams } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();

  return (
    <Form action="/search" className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        key={searchParams?.get('q')}
        type="text"
        name="q"
        placeholder="Search for products..."
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 pl-10 text-sm text-black placeholder:text-neutral-500 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
      />
      <div className="absolute left-0 top-0 ml-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4 w-4 text-neutral-500" />
      </div>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <div className="w-full lg:w-80 xl:w-full">
      <div className="animate-pulse rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2 pl-10 text-sm">
        <div className="h-4 w-32 bg-neutral-200 rounded"></div>
      </div>
    </div>
  );
}