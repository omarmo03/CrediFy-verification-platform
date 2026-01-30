CREATE TABLE `joinRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255) NOT NULL,
	`profileLink` varchar(500) NOT NULL,
	`message` text,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `joinRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`profileLink` varchar(500) NOT NULL,
	`status` enum('trusted','scammer','not_found') NOT NULL,
	`proofCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `profiles_profileLink_unique` UNIQUE(`profileLink`)
);
--> statement-breakpoint
CREATE INDEX `idx_email` ON `joinRequests` (`email`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `joinRequests` (`status`);--> statement-breakpoint
CREATE INDEX `idx_name` ON `profiles` (`name`);--> statement-breakpoint
CREATE INDEX `idx_profileLink` ON `profiles` (`profileLink`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `profiles` (`status`);