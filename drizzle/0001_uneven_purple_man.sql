ALTER TABLE "articles" DROP CONSTRAINT "articles_user_id_unique";--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "user_id" SET DATA TYPE varchar(290);--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "title" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "link" SET DATA TYPE varchar(700);--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "date" SET DATA TYPE varchar(80);--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "image_url" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "category" SET DATA TYPE varchar(70);--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "description" varchar;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_id_unique" UNIQUE("id");