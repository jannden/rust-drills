ALTER TABLE "Deck" RENAME CONSTRAINT "Article_pkey" TO "Deck_pkey";
ALTER TABLE "Deck" ADD COLUMN "canonicalUrl" TEXT;
ALTER TABLE "Deck" ADD COLUMN "slug" TEXT;


UPDATE "Deck" SET
"canonicalUrl" = '',
"slug" = ''
WHERE "canonicalUrl" IS NULL;

ALTER TABLE "Deck" ALTER COLUMN "canonicalUrl" SET NOT NULL;
ALTER TABLE "Deck" ALTER COLUMN "slug" SET NOT NULL;

ALTER TABLE "Deck" ADD CONSTRAINT "Deck_slug_key" UNIQUE ("slug");