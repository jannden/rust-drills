/*
  Warnings:

  - Added the required column `categorySlug` to the `Deck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryTitle` to the `Deck` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deck" ADD COLUMN     "categorySlug" TEXT NOT NULL,
ADD COLUMN     "categoryTitle" TEXT NOT NULL;
