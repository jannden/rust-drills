-- AlterTable
ALTER TABLE "Prompt" ADD COLUMN     "restartedAt" TIMESTAMP(3);

-- RenameIndex
ALTER INDEX "unique_user_deck_snippet" RENAME TO "Memory_userId_deckSlug_snippetSlug_key";
