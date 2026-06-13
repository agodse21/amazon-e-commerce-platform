-- Wishlist: session-based for guest users (matches cart pattern)

-- Drop old unique constraint and make user_id optional
DROP INDEX IF EXISTS "wishlists_user_id_product_id_key";
ALTER TABLE "wishlists" ALTER COLUMN "user_id" DROP NOT NULL;

-- Add session_id (backfill empty table; safe for existing empty wishlists)
ALTER TABLE "wishlists" ADD COLUMN IF NOT EXISTS "session_id" TEXT;

UPDATE "wishlists" SET "session_id" = 'legacy-migration' WHERE "session_id" IS NULL;

ALTER TABLE "wishlists" ALTER COLUMN "session_id" SET NOT NULL;

-- New unique constraint per session + product
CREATE UNIQUE INDEX IF NOT EXISTS "wishlists_session_id_product_id_key"
  ON "wishlists"("session_id", "product_id");

CREATE INDEX IF NOT EXISTS "wishlists_session_id_idx" ON "wishlists"("session_id");
