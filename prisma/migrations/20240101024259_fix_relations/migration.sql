-- DropForeignKey
ALTER TABLE `tbl_admin` DROP FOREIGN KEY `tbl_admin_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_event` DROP FOREIGN KEY `tbl_event_id_creator_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_user_event` DROP FOREIGN KEY `tbl_user_event_idEvent_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_user_event` DROP FOREIGN KEY `tbl_user_event_idUser_fkey`;

-- AlterTable
ALTER TABLE `tbl_event` ALTER COLUMN `event_date` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `tbl_event` ADD CONSTRAINT `tbl_event_id_creator_fkey` FOREIGN KEY (`id_creator`) REFERENCES `tbl_admin`(`id_user`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_user_event` ADD CONSTRAINT `tbl_user_event_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `tbl_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_user_event` ADD CONSTRAINT `tbl_user_event_idEvent_fkey` FOREIGN KEY (`idEvent`) REFERENCES `tbl_event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_admin` ADD CONSTRAINT `tbl_admin_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `tbl_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
