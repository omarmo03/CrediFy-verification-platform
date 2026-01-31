CREATE TABLE `reportEvidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportId` int NOT NULL,
	`fileUrl` text NOT NULL,
	`fileType` varchar(50) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reportEvidence_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reporterEmail` varchar(320) NOT NULL,
	`reporterName` varchar(255) NOT NULL,
	`scammerName` varchar(255) NOT NULL,
	`scammerLink` varchar(500) NOT NULL,
	`description` text NOT NULL,
	`evidence` text,
	`status` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `profiles` ADD `rank` enum('verified','top_seller','middleman') DEFAULT 'verified';--> statement-breakpoint
ALTER TABLE `profiles` ADD `description` text;--> statement-breakpoint
CREATE INDEX `idx_reportId` ON `reportEvidence` (`reportId`);--> statement-breakpoint
CREATE INDEX `idx_scammerLink` ON `reports` (`scammerLink`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `reports` (`status`);--> statement-breakpoint
CREATE INDEX `idx_createdAt` ON `reports` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_rank` ON `profiles` (`rank`);