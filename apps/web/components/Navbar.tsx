"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import PersonIcon from "./workspace/Icon/PersonIcon";

export default function Navbar() {
  const { data: session } = useSession();
  console.log(session);

  return (
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
                <img
                  src={session.user?.image}
                  alt=""
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <PersonIcon />
              )}
            </div>
            <button
              onClick={() => signOut()}
              className="cursor-pointer hover:text-violet-300"
            >
              Log Out
            </button>
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
  );
}
