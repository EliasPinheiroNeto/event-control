-- AlterTable
ALTER TABLE `tbl_event` ALTER COLUMN `event_date` DROP DEFAULT;

-- AlterTable
ALTER TABLE `tbl_user_event` ADD COLUMN `check_in` BOOLEAN NOT NULL DEFAULT false;
