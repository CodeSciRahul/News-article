CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"link" varchar(512) NOT NULL,
	"snippet" varchar NOT NULL,
	"date" varchar(50),
	"source" varchar,
	"image_url" varchar(512),
	"category" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "articles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "userPreferences" (
	"user_id" varchar PRIMARY KEY NOT NULL,
	"category" json,
	"language" varchar(30) DEFAULT 'eng',
	"location" varchar(70) DEFAULT 'in',
	CONSTRAINT "userPreferences_user_id_unique" UNIQUE("user_id")
);
