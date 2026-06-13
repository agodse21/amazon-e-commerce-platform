import { createFileRoute, Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/wishlist')({
  component: WishlistPage,
});

function WishlistPage() {
  return (
    <div className="page-container max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Wish List</h1>
      <div className="amazon-panel text-center py-16">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-medium mb-2">Your Wish List is empty</h2>
        <p className="text-gray-500 text-sm mb-4">
          Sign in and add items to your wish list to save them for later.
        </p>
        <Link to="/" className="text-amazon-link-blue hover:underline text-sm">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
