/*
  Warnings:

  - Added the required column `token` to the `tbl_user_event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tbl_event` ALTER COLUMN `event_date` DROP DEFAULT;

-- AlterTable
ALTER TABLE `tbl_user_event` ADD COLUMN `check_in` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `token` LONGTEXT NOT NULL;
