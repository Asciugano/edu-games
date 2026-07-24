-- CreateTable
CREATE TABLE "image" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "images" TEXT[],
    "category" TEXT,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);
