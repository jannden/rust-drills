ALTER TABLE "Deck" RENAME CONSTRAINT "Article_pkey" TO "Deck_pkey";
ALTER TABLE "Deck" ADD COLUMN "canonicalUrl" TEXT;
ALTER TABLE "Deck" ADD COLUMN "slug" TEXT;


UPDATE "Deck" SET
"canonicalUrl" = '',
"slug" = '1'
WHERE "canonicalUrl" IS NULL AND "slug" IS NULL LIMIT 1;
UPDATE "Deck" SET
"canonicalUrl" = '',
"slug" = '2'
WHERE "canonicalUrl" IS NULL AND "slug" IS NULL LIMIT 1;
UPDATE "Deck" SET
"canonicalUrl" = '',
"slug" = '3'
WHERE "canonicalUrl" IS NULL AND "slug" IS NULL LIMIT 1;
UPDATE "Deck" SET
"canonicalUrl" = '',
"slug" = '4'
WHERE "canonicalUrl" IS NULL AND "slug" IS NULL LIMIT 1;
UPDATE "Deck" SET
"canonicalUrl" = '',
"slug" = '5'
WHERE "canonicalUrl" IS NULL AND "slug" IS NULL LIMIT 1;
UPDATE "Deck" SET
"canonicalUrl" = '',
"slug" = '6'
WHERE "canonicalUrl" IS NULL AND "slug" IS NULL LIMIT 1;
UPDATE "Deck" SET
"canonicalUrl" = '',
"slug" = '7'
WHERE "canonicalUrl" IS NULL AND "slug" IS NULL LIMIT 1;
UPDATE "Deck" SET
"canonicalUrl" = '',
"slug" = '8'
WHERE "canonicalUrl" IS NULL AND "slug" IS NULL LIMIT 1;
UPDATE "Deck" SET
"canonicalUrl" = '',
"slug" = '9'
WHERE "canonicalUrl" IS NULL AND "slug" IS NULL LIMIT 1;

ALTER TABLE "Deck" ALTER COLUMN "canonicalUrl" SET NOT NULL;
ALTER TABLE "Deck" ALTER COLUMN "slug" SET NOT NULL;

ALTER TABLE "Deck" ADD CONSTRAINT "Deck_slug_key" UNIQUE ("slug");