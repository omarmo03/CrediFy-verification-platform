CREATE TABLE `appeals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appeals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `siteSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`type` enum('string','number','boolean','json') NOT NULL DEFAULT 'string',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `siteSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `siteSettings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
ALTER TABLE `profiles` MODIFY COLUMN `status` enum('trusted','scammer','not_found','suspicious') NOT NULL;--> statement-breakpoint
ALTER TABLE `profiles` ADD `phone` varchar(20);--> statement-breakpoint
CREATE INDEX `idx_profileId` ON `appeals` (`profileId`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `appeals` (`status`);--> statement-breakpoint
CREATE INDEX `idx_key` ON `siteSettings` (`key`);