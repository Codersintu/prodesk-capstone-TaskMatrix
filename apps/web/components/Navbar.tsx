"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar(){
    const {data: session} = useSession();
    console.log(session);

    return(
        <div className="w-full mt-6">
            <div className="flex justify-between items-center">
                {/* logo */}
                <div className="">
                    <h1 className="text-3xl font-bold ">TaskMatrix</h1>
                </div>
                {/* feature */}
                <div className=" backdrop-blur-md border border-white/30 shadow-lg shadow-black/20 rounded-full">
                    <ul className="flex justify-around items-center gap-15 py-3 px-5">
                        <li className="cursor-pointer ">Home</li>
                        <li className="cursor-pointer ">Pages</li>
                        <li className="cursor-pointer ">About</li>
                        <li className="cursor-pointer ">Features</li>
                    </ul>
                </div>
                {/* CTA button */}
                {session ? (
                    <div className="flex items-center gap-5">
                    <div className="flex backdrop-blur-md border border-white/30 shadow-lg shadow-black/20 rounded-full ">
                        {session.user?.image ? (
                            <img src={session.user?.image } alt="" className="h-10 w-10 rounded-full" />
                        ):(
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 border-2 border-cyan-400 rounded-full">
                        <path strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        )}
                    </div>
                    <button onClick={()=>signOut()} className="cursor-pointer hover:text-violet-300">Log Out</button>
                    </div>
                    ) : (
                 <Link href="/signin">
                    <div className="backdrop-blur-md border border-white/30 shadow-lg shadow-black/20 rounded-full py-2 px-2 cursor-pointer">
                        Get In Touch
                    </div>
                </Link>
                )}
            </div>    
        </div>
    )
}