import clsx from 'clsx';

const LoadingDots = ({ className }: { className?: string }) => {
  return (
    <span className="mx-[1px] inline-flex items-center">
      <span
        className={clsx(
          'mx-[1px] h-1 w-1 animate-pulse rounded-full',
          className
        )}
        style={{ animationDelay: '0ms' }}
      />
      <span
        className={clsx(
          'mx-[1px] h-1 w-1 animate-pulse rounded-full',
          className
        )}
        style={{ animationDelay: '150ms' }}
      />
      <span
        className={clsx(
          'mx-[1px] h-1 w-1 animate-pulse rounded-full',
          className
        )}
        style={{ animationDelay: '300ms' }}
      />
    </span>
  );
};

export default LoadingDots;