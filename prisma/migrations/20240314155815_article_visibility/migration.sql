-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Article" SET "isVisible" = true WHERE "order" = '1';
