'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { createUrl } from '@/lib/utils';

interface FilterOptions {
  categories: string[];
  materials: string[];
  finishes: string[];
  sizes: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

function FilterItemList({ list }: { list: FilterOptions }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [openFilters, setOpenFilters] = useState<string[]>(['categories']);

  const createFilterUrl = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return createUrl(pathname, params);
  };

  const removeFilterUrl = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(name);
    return createUrl(pathname, params);
  };

  const toggleFilter = (filterName: string) => {
    setOpenFilters(prev => 
      prev.includes(filterName) 
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName]
    );
  };

  const FilterSection = ({ 
    title, 
    items, 
    paramName 
  }: { 
    title: string; 
    items: string[]; 
    paramName: string;
  }) => {
    const isOpen = openFilters.includes(paramName);
    const currentValue = searchParams.get(paramName);

    return (
      <div className="mb-4">
        <button
          onClick={() => toggleFilter(paramName)}
          className="flex w-full items-center justify-between py-2 text-sm font-medium text-black dark:text-white"
        >
          {title}
          <ChevronDownIcon 
            className={clsx('h-4 w-4 transition-transform', {
              'rotate-180': isOpen
            })}
          />
        </button>
        {isOpen && (
          <ul className="mt-2 space-y-2">
            {items.map((item) => (
              <li key={item}>
                <button
                  onClick={() => {
                    if (currentValue === item) {
                      router.push(removeFilterUrl(paramName));
                    } else {
                      router.push(createFilterUrl(paramName, item));
                    }
                  }}
                  className={clsx(
                    'block w-full text-left text-sm underline-offset-4 hover:underline transition-colors',
                    {
                      'text-black font-medium dark:text-white': currentValue === item,
                      'text-neutral-500 dark:text-neutral-400': currentValue !== item
                    }
                  )}
                >
                  {item.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <nav>
      <h3 className="hidden text-xs text-neutral-500 md:block dark:text-neutral-400">Filters</h3>
      <div className="mt-4">
        <FilterSection 
          title="Categories" 
          items={list.categories} 
          paramName="category"
        />
        {list.materials.length > 0 && (
          <FilterSection 
            title="Materials" 
            items={list.materials} 
            paramName="material"
          />
        )}
        {list.finishes.length > 0 && (
          <FilterSection 
            title="Finishes" 
            items={list.finishes} 
            paramName="finish"
          />
        )}
        {list.sizes.length > 0 && (
          <FilterSection 
            title="Sizes" 
            items={list.sizes} 
            paramName="size"
          />
        )}
      </div>
    </nav>
  );
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded-sm';
const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300';
const items = 'bg-neutral-400 dark:bg-neutral-700';

export default function FilterList({ list, title }: { list: FilterOptions; title?: string }) {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <FilterItemList list={list} />
    </Suspense>
  );
}