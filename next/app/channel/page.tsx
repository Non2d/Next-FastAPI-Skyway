"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";

import Image from 'next/image'
import background from 'public/images/playmat.webp'

export default function Channel() {
  let DynamicComponent = dynamic(() => import("./dynamicComponentRoomSFU"), {
    ssr: false,
  });
  useEffect(() =>{
  },[])

  return (
    <div>
      
    {/* <Image
      alt="Background Card Mat Image"
      src={background}
      placeholder="blur"
      quality={100}
      fill
      sizes="100vw"
      style={{
        objectFit: 'cover',
        zIndex: -1,
      }}
    /> */}
      {<DynamicComponent />}
    </div>
  )
}
