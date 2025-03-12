CREATE TABLE "profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"metadata" jsonb,
	"userId" integer
);
--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;