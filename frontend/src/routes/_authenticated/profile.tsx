import { createFileRoute } from '@tanstack/react-router';
import { User } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="page-container max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Account</h1>
      <div className="amazon-panel text-center py-12">
        <div className="w-20 h-20 rounded-full bg-amazon-navy flex items-center justify-center mx-auto mb-4">
          <User className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-xl font-medium mb-2">Guest User</h2>
        <p className="text-gray-500 text-sm">
          Sign in or create an account to access your full profile.
        </p>
        <p className="text-xs text-gray-400 mt-4">
          Authentication coming soon.
        </p>
      </div>
    </div>
  );
}
