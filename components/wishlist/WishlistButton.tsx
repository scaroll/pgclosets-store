'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/lib/wishlist-store';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface WishlistButtonProps {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
    url: string;
  };
  variant?: 'icon' | 'default';
  className?: string;
}

export function WishlistButton({ product, variant = 'default', className }: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    useWishlistStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (mounted) {
      setIsWishlisted(isInWishlist(product.id));
    }
  }, [mounted, isInWishlist, product.id]);

  const handleToggle = () => {
    if (isWishlisted) {
      removeItem(product.id);
      toast.success('Removed from wishlist');
    } else {
      addItem(product);
      toast.success('Added to wishlist');
    }
    setIsWishlisted(!isWishlisted);
  };

  if (!mounted) {
    return null;
  }

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className={cn(
          'rounded-full',
          isWishlisted && 'text-red-500',
          className
        )}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={cn(
            'h-5 w-5',
            isWishlisted && 'fill-current'
          )}
        />
      </Button>
    );
  }

  return (
    <Button
      variant={isWishlisted ? 'secondary' : 'outline'}
      onClick={handleToggle}
      className={className}
    >
      <Heart
        className={cn(
          'h-4 w-4 mr-2',
          isWishlisted && 'fill-current text-red-500'
        )}
      />
      {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
    </Button>
  );
}

export function WishlistIndicator() {
  const [mounted, setMounted] = useState(false);
  const itemCount = useWishlistStore((state) => state.getItemCount());

  useEffect(() => {
    setMounted(true);
    useWishlistStore.persist.rehydrate();
  }, []);

  if (!mounted || itemCount === 0) {
    return null;
  }

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {itemCount}
    </span>
  );
}