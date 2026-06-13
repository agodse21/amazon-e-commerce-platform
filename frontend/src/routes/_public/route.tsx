import { createFileRoute, Outlet } from '@tanstack/react-router';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#EAEDED]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
