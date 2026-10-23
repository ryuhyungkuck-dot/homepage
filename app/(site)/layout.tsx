import { Starfield } from '@/components/Starfield';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Starfield />
      {children}
    </>
  );
}
