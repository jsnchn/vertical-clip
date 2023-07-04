import * as React from "react";
import tw, { styled } from "twin.macro";
import Image from "next/image";

export const Loading = () => {
  return (
    <ImageCont>
      <Image
        src={"/gifs/loading-gif-light.gif"}
        alt="Pipeline Logo"
        height={56}
        width={56}
      />
    </ImageCont>
  );
};

const ImageCont = tw.div`m-auto`;
