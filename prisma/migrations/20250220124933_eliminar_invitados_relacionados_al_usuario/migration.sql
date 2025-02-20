-- DropForeignKey
ALTER TABLE `invitados` DROP FOREIGN KEY `Invitados_user_id_fkey`;

-- DropIndex
DROP INDEX `Invitados_user_id_fkey` ON `invitados`;

-- AddForeignKey
ALTER TABLE `Invitados` ADD CONSTRAINT `Invitados_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
