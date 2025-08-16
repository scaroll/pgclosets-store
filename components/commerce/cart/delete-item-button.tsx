'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { PGCartItem } from '@/lib/pgclosets/types';
import { useCart } from '@/components/commerce/cart-context';

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (loading) e.preventDefault();
      }}
      aria-label="Remove cart item"
      aria-disabled={loading}
      className={clsx(
        'ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200',
        {
          'cursor-not-allowed px-0': loading
        }
      )}
    >
      {loading ? (
        <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
      ) : (
        <XMarkIcon className="hover:text-accent-3 mx-[1px] h-4 w-4 text-white" />
      )}
    </button>
  );
}

export default function DeleteItemButton({ 
  item, 
  optimisticUpdate 
}: { 
  item: PGCartItem;
  optimisticUpdate?: (merchandiseId: string, updateType: 'plus' | 'minus' | 'delete') => void;
}) {
  const { updateCartItem } = useCart();

  return (
    <form
      action={() => {
        if (optimisticUpdate) {
          optimisticUpdate(item.merchandise.id, 'delete');
        } else {
          updateCartItem(item.merchandise.id, 'delete');
        }
      }}
    >
      <SubmitButton loading={false} />
    </form>
  );
}