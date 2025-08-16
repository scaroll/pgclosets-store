'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { PGCartItem } from '@/lib/pgclosets/types';
import { useCart, type UpdateType } from '@/components/commerce/cart-context';

function SubmitButton({
  type,
  loading,
  availableForSale
}: {
  type: UpdateType;
  loading: boolean;
  availableForSale: boolean;
}) {
  const buttonClasses =
    'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button aria-label="This product is out of stock" disabled className={clsx(buttonClasses, disabledClasses)}>
        <Minus />
      </button>
    );
  }

  if (loading) {
    return (
      <button aria-label={`${type === 'plus' ? 'Adding' : 'Removing'} item...`} disabled className={clsx(buttonClasses, disabledClasses)}>
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-transparent" />
      </button>
    );
  }

  return (
    <button
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
      className={buttonClasses}
    >
      {type === 'plus' ? <Plus /> : <Minus />}
    </button>
  );
}

function Plus() {
  return <PlusIcon className="h-4 w-4" />;
}

function Minus() {
  return <MinusIcon className="h-4 w-4" />;
}

export default function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate
}: {
  item: PGCartItem;
  type: UpdateType;
  optimisticUpdate?: (merchandiseId: string, updateType: UpdateType) => void;
}) {
  const { updateCartItem } = useCart();

  return (
    <form
      action={() => {
        if (optimisticUpdate) {
          optimisticUpdate(item.merchandise.id, type);
        } else {
          updateCartItem(item.merchandise.id, type);
        }
      }}
    >
      <SubmitButton type={type} loading={false} availableForSale={true} />
    </form>
  );
}