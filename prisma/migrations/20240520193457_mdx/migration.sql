-- Add deckSlug and snippetSlug to Memory table
ALTER TABLE "Memory"
ADD COLUMN "deckSlug" TEXT,
ADD COLUMN "snippetSlug" TEXT;


-- Update Memory table with deckSlug and snippetSlug
UPDATE "Memory" m
SET "deckSlug" = d."slug",
  "snippetSlug" = LOWER(REGEXP_REPLACE(s."heading", ' ', '-', 'g'))
FROM "Deck" d, "Snippet" s
WHERE m."snippetId" = s."id" AND s."deckId" = d."id";

-- AlterTable
ALTER TABLE "Memory" ALTER COLUMN "deckSlug" SET NOT NULL;

-- AlterTable
ALTER TABLE "Memory" ALTER COLUMN "snippetSlug" SET NOT NULL;

-- Add unique constraint
ALTER TABLE "Memory" ADD CONSTRAINT "unique_user_deck_snippet" UNIQUE ("userId", "deckSlug", "snippetSlug");

-- DropForeignKey
ALTER TABLE "Memory" DROP CONSTRAINT "Memory_snippetId_fkey";

-- DropForeignKey
ALTER TABLE "Snippet" DROP CONSTRAINT "Snippet_deckId_fkey";

-- AlterTable
ALTER TABLE "Memory" DROP COLUMN "snippetId";

-- DropTable
DROP TABLE "Deck";

-- DropTable
DROP TABLE "Snippet";