-- CreateTable
CREATE TABLE `tbl_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(191) NOT NULL,
    `second_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbl_user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `tickets` INTEGER NOT NULL,
    `event_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_creator` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_user_event` (
    `idUser` INTEGER NOT NULL,
    `idEvent` INTEGER NOT NULL,

    PRIMARY KEY (`idUser`, `idEvent`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_admin` (
    `id_user` INTEGER NOT NULL,

    UNIQUE INDEX `tbl_admin_id_user_key`(`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_event` ADD CONSTRAINT `tbl_event_id_creator_fkey` FOREIGN KEY (`id_creator`) REFERENCES `tbl_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_user_event` ADD CONSTRAINT `tbl_user_event_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `tbl_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_user_event` ADD CONSTRAINT `tbl_user_event_idEvent_fkey` FOREIGN KEY (`idEvent`) REFERENCES `tbl_event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_admin` ADD CONSTRAINT `tbl_admin_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `tbl_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
