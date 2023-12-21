/*
  Warnings:

  - You are about to alter the column `name` on the `tbl_event` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `first_name` on the `tbl_user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `second_name` on the `tbl_user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `email` on the `tbl_user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(150)`.
  - You are about to alter the column `password` on the `tbl_user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(150)`.

*/
-- AlterTable
ALTER TABLE `tbl_event` MODIFY `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `tbl_user` MODIFY `first_name` VARCHAR(100) NOT NULL,
    MODIFY `second_name` VARCHAR(100) NOT NULL,
    MODIFY `email` VARCHAR(150) NOT NULL,
    MODIFY `password` VARCHAR(150) NOT NULL;
