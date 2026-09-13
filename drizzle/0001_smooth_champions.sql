CREATE TABLE `musical_price_overrides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`musicalId` varchar(128) NOT NULL,
	`priceFrom` varchar(32) NOT NULL,
	`saleLabel` varchar(64),
	`saleDiscount` varchar(64),
	`saleNote` text,
	`saleEndsAt` timestamp,
	`updatedByOpenId` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `musical_price_overrides_id` PRIMARY KEY(`id`),
	CONSTRAINT `musical_price_overrides_musicalId_unique` UNIQUE(`musicalId`)
);
