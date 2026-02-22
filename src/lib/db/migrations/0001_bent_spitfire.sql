ALTER TYPE "public"."user_role" ADD VALUE 'customer';--> statement-breakpoint
CREATE INDEX "search_index" ON "products" USING gin (to_tsvector('indonesian', "name" || ' ' || "description"));