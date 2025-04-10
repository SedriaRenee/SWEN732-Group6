"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = false; // Replace this with your actual auth check

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start justify-items-center">
        <h1 className="text-white text-2xl text-bold">Welcome to Travel Guardian!</h1>
        <p className="text-white text-xl">Find up-to-date travel guidelines for any city in the world!</p>

        <div className="text-center flex flex-col w-full">
          <a className="text-blue-500 text-bold text-2xl p-0" href="/countries">
            Browse countries
          </a>
          <p className="text-xl font-black p-0">OR</p>
          <p className="text-white text-2xl text-bold p-0">Search for your travel destination</p>
        </div>
      </main>
    </div>
  );
}
