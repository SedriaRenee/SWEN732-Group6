-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "profilePic" TEXT,
    "name" TEXT,
    "age" INTEGER,
    "hometown" TEXT,
    "placesVisited" TEXT[],
    "placesToVisit" TEXT[],

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_userId_key" ON "profile"("userId");

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
