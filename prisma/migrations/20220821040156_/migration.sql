/*
  Warnings:

  - You are about to drop the `_Follows` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_Follows` DROP FOREIGN KEY `_Follows_A_fkey`;

-- DropForeignKey
ALTER TABLE `_Follows` DROP FOREIGN KEY `_Follows_B_fkey`;

-- DropTable
DROP TABLE `_Follows`;

-- CreateTable
CREATE TABLE `_UserFollows` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_UserFollows_AB_unique`(`A`, `B`),
    INDEX `_UserFollows_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UserFollows` ADD CONSTRAINT `_UserFollows_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserFollows` ADD CONSTRAINT `_UserFollows_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
