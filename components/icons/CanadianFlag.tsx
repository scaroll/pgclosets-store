export function CanadianFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="24" height="16" fill="#FF0000" />
      <rect x="4" width="16" height="16" fill="#FFFFFF" />
      <rect x="7" width="10" height="16" fill="#FF0000" />
      <path
        d="M12 2 L13.5 6 L17.5 6 L14 8.5 L15.5 12.5 L12 10 L8.5 12.5 L10 8.5 L6.5 6 L10.5 6 Z"
        fill="#FF0000"
      />
    </svg>
  );
}