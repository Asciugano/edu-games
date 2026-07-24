-- CreateTable
CREATE TABLE "quantity" (
    "id" TEXT NOT NULL,
    "fewWord" TEXT NOT NULL,
    "manyWord" TEXT NOT NULL,
    "letter" VARCHAR(1) NOT NULL,
    "fewImage" TEXT NOT NULL,
    "manyImage" TEXT NOT NULL,
    "category" TEXT,

    CONSTRAINT "quantity_pkey" PRIMARY KEY ("id")
);
