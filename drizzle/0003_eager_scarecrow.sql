ALTER TABLE "comments" ADD COLUMN "text" text NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "authorId" integer;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "postId" integer;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;