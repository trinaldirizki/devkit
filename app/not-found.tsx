import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface text-center">
      <h1 className="text-[57px] font-medium leading-[64px] text-on-surface">404</h1>
      <p className="text-[16px] leading-[24px] text-on-surface-variant">
        This page does not exist.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-full bg-primary px-6 py-2.5 text-[14px] font-medium leading-[20px] text-primary-foreground shadow-elevation-1 transition-shadow duration-md-short ease-md-standard hover:shadow-elevation-2"
      >
        Back to Home
      </Link>
    </div>
  );
}
