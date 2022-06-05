import Image from "next/image";
import React from "react";
import {
  ChevronDownIcon,
  HomeIcon,
  SearchIcon,
  MenuIcon,
} from "@heroicons/react/solid";
import {
  BellIcon,
  ChatIcon,
  GlobeIcon,
  PlusIcon,
  SparklesIcon,
  SpeakerphoneIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

function Header() {
  const { data: session } = useSession();
  return (
    <nav className="sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm items-center">
      <div className="relative h-10 w-20 flex-shrink-0 cursor-pointer">
        <Link href={"/"}>
          <Image
            objectFit="contain"
            src="https://links.papareact.com/fqy"
            layout="fill"
          />
        </Link>
      </div>

      <Link href={"/"}>
        <div className="flex items-center mx-7 xl:min-w-[300px]">
          <HomeIcon className="h-5 w-5 cursor-pointer" />
          <p className="flex-1 ml-2 hidden lg:inline cursor-pointer">Home</p>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </Link>

      <form className="flex flex-1 items-center space-x-2 border-gray-200 rounded-sm bg-gray-100 px-3 py-1">
        <SearchIcon className="h-6 w-6 text-gray-400" />
        <input
          className="flex-1 bg-transparent outline-none"
          type="text"
          placeholder="Search Reddit"
        />
        <button onClick={(e) => e.preventDefault()} type="submit" hidden />
      </form>

      <div className="text-gray-500 space-x-2 items-center mx-5 hidden lg:inline-flex">
        <SparklesIcon className="icon" />
        <GlobeIcon className="icon" />
        <VideoCameraIcon className="icon h-10 border-gray-100" />

        <ChatIcon className="icon" />
        <BellIcon className="icon" />
        <PlusIcon className="icon" />
        <SpeakerphoneIcon className="icon" />
      </div>

      <div className="lg:hidden">
        <MenuIcon className="icon" />
      </div>

      {/* Signin and Signout Button */}
      {session ? (
        <div
          onClick={() => signOut()}
          className="hidden md:flex space-x-2 border border-gray-100 items-center p-2 cursor-pointer text-gray-500"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              objectFit="contain"
              layout="fill"
              src="https://links.papareact.com/23l"
            />
          </div>
          <div className="flex-1 text-xs">
            <p className="truncate">{session?.user?.name}</p>
            <p>Sign Out</p>
          </div>

          <ChevronDownIcon className="h-5 flex-shrink-0 text-gray-400" />
        </div>
      ) : (
        <div
          onClick={() => signIn("reddit")}
          className="hidden md:flex space-x-2 border border-gray-100 items-center p-2 cursor-pointer text-gray-500"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              objectFit="contain"
              layout="fill"
              src="https://links.papareact.com/23l"
            />
          </div>
          <p>Signin</p>
        </div>
      )}
    </nav>
  );
}

export default Header;
