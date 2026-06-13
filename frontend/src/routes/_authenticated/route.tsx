import { createFileRoute, Outlet } from '@tanstack/react-router';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

/**
 * _authenticated/route.tsx — Protected layout group
 *
 * Currently passes through (auth not yet implemented).
 * To add auth guard later, add a `beforeLoad` here:
 *
 * beforeLoad: ({ context }) => {
 *   if (!context.auth.isAuthenticated) {
 *     throw redirect({ to: '/login' });
 *   }
 * },
 */
export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
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
