-- Drop the foreign key constraint
ALTER TABLE "Snippet" DROP CONSTRAINT "Snippet_articleId_fkey";

-- Rename the column articleId to deckId in Snippet table
ALTER TABLE "Snippet" RENAME COLUMN "articleId" TO "deckId";

-- Rename table Article to Deck
ALTER TABLE "Article" RENAME TO "Deck";

-- Add the foreign key constraint back with the new column and table names
ALTER TABLE "Snippet" ADD CONSTRAINT "Snippet_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;