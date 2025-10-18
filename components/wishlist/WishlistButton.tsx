'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/lib/wishlist-store';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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

  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);

    if (isWishlisted) {
      removeItem(product.id);
      toast.success('Removed from wishlist', {
        description: `${product.name} has been removed from your wishlist.`
      });
    } else {
      addItem(product);
      toast.success('Added to wishlist', {
        description: `${product.name} has been added to your wishlist.`
      });
    }
    setIsWishlisted(!isWishlisted);

    setTimeout(() => setIsAnimating(false), 300);
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
        disabled={isAnimating}
        className={cn(
          'rounded-full relative overflow-hidden group transition-all duration-200',
          isWishlisted && 'text-red-500 hover:text-red-600',
          !isWishlisted && 'text-gray-500 hover:text-red-500',
          className
        )}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <motion.div
          animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <Heart
            className={cn(
              'h-5 w-5 transition-all duration-200',
              isWishlisted && 'fill-current text-red-500'
            )}
          />
        </motion.div>

        {/* Ripple effect */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-red-500 rounded-full"
            />
          )}
        </AnimatePresence>

        {/* Hover effect */}
        <motion.div
          className="absolute inset-0 bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          whileHover={{ scale: 0.9 }}
        />
      </Button>
    );
  }

  return (
    <Button
      variant={isWishlisted ? 'secondary' : 'outline'}
      onClick={handleToggle}
      disabled={isAnimating}
      className={cn(
        'relative overflow-hidden group transition-all duration-200',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-all duration-200',
              isWishlisted && 'fill-current text-red-500'
            )}
          />
        </motion.div>
        <span>{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>

        {/* Ripple effect */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ scale: 0, opacity: 0.3 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-red-500 rounded-md"
            />
          )}
        </AnimatePresence>
      </div>
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
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ type: "spring", duration: 0.3 }}
      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg"
    >
      <motion.span
        key={itemCount}
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {itemCount > 99 ? '99+' : itemCount}
      </motion.span>
    </motion.span>
  );
}