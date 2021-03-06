import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

type Props = {
  seed?: string;
  large?: boolean;
};

function Avatar({ seed, large }: Props) {
  const { data: session } = useSession();
  return (
    <div
      className={`relative overflow-hidden rounded-full border-gray-300 bg-white ${
        large ? "h-20 w-20" : "h-10 w-10"
      }`}
    >
      <Image
        src={`https://avatars.dicebear.com/api/micah/${
          seed || session?.user?.name || "placeholder"
        }.svg`}
        layout="fill"
        objectFit="contain"
      />
    </div>
  );
}

export default Avatar;
