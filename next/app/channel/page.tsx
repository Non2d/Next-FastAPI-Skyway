"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";

import Image from 'next/image'
import background from 'public/images/playmat.webp'

import SSEComponent from "./SSEComponent"; // SSEComponentをインポート

export default function Channel() {
  let DynamicComponent = dynamic(() => import("./dynamicComponentRoomSFU"), {
    ssr: false,
  });
  useEffect(() => {
  }, [])

  return (
    <div>
      {/* <Image
        alt="Background Card Mat Image"
        src={background        placeholder="blur"
        quality={100}
        fill
        sizes="100vw"
        style={{
          objectFit: 'cover',
          zIndex: -1,
        }}
      /> */}
      <DynamicComponent /> {/* DynamicComponentを表示 */}
      <SSEComponent /> {/* SSEComponentを表示 */}
    </div>
  )
}
