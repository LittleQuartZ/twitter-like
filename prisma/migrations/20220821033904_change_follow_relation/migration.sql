/*
  Warnings:

  - You are about to drop the `Follows` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Follows` DROP FOREIGN KEY `Follows_followerId_fkey`;

-- DropForeignKey
ALTER TABLE `Follows` DROP FOREIGN KEY `Follows_followingId_fkey`;

-- DropTable
DROP TABLE `Follows`;

-- CreateTable
CREATE TABLE `_Follows` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_Follows_AB_unique`(`A`, `B`),
    INDEX `_Follows_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_Follows` ADD CONSTRAINT `_Follows_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Follows` ADD CONSTRAINT `_Follows_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
