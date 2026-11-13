"use client";
import { useSession } from "next-auth/react";
import Navbar from "./Navbar";
import Link from "next/link";

export default function Hero(){
    const {data: session} = useSession();

    return(
        <div className="w-full max-w-6xl mx-auto">
            <Navbar/>
            <div className="h-full w-full flex items-center justify-center pt-30">
                <div className="flex flex-col gap-4">
                <h1 className="text-center text-5xl md:text-6xl font-semibold tracking-tight leading-[1.2]">
                  Manage projects, tasks
                  <br />
                  <span className="inline-block mt-2">
                    &amp; team workflows
                  </span>
                </h1>
                <p className="text-lg text-center mt-4">
                    Streamline your work and boost productivity with our <br /> intuitive task management solution.
                </p>

                <div className="flex items-center justify-center mt-6">
                    {session ? (
                        <button className="bg-linear-to-t from-[#201f5e]/95 via-[#121075]/95 to-[#030254] backdrop-blur-md border border-white/30 shadow-lg shadow-black/20 rounded-full py-3 px-8 cursor-pointer">Get Started</button>
                    ) : (
                        <Link href="/signin">
                            <div className="bg-linear-to-t from-[#201f5e]/95 via-[#121075]/95 to-[#030254] backdrop-blur-md border border-white/30 shadow-lg shadow-black/20 rounded-full py-3 px-8 cursor-pointer">
                                Sign Up
                            </div>
                        </Link>
                    )}
                </div>
                </div>
            </div>
        </div>
    )
}