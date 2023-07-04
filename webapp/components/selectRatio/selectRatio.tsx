import React, { useState } from "react";
import tw, { styled } from "twin.macro";
import Image from "next/image";
export interface SelectRatioProps {
  setRatio: (ratio: "split" | "fullscreen") => void;
}
export const SelectRatio = ({ setRatio }: SelectRatioProps) => {
  return (
    <>
      <Title></Title>
      <Ratios>
        {/* Fullscreen*/}
        <Ratio
          onClick={() => {
            setRatio("fullscreen");
          }}
        >
          <RatioIcon>
            <Image
              src={"/fullscreen_icon.svg"}
              layout={"responsive"}
              width={9}
              height={16}
            />
          </RatioIcon>
          <RatioTitle>Fullscreen</RatioTitle>
          <RatioDesc>
            Best if you don't have a
            <br />
            face cam.
          </RatioDesc>
          <RatioExample>
            <Image
              src={"/fullscreen_example.png"}
              layout={"responsive"}
              width={9}
              height={16}
            />
          </RatioExample>
        </Ratio>

        {/* Split */}
        <Ratio
          onClick={() => {
            setRatio("split");
          }}
        >
          <RatioIcon>
            <Image
              src={"/split_icon.svg"}
              layout={"responsive"}
              width={9}
              height={16}
            />
          </RatioIcon>
          <RatioTitle>Split</RatioTitle>
          <RatioDesc>
            Clips with face cam have
            <br />
            higher engagement.
          </RatioDesc>
          <RatioExample>
            <Image
              src={"/split_example.png"}
              layout={"responsive"}
              width={9}
              height={16}
            />
          </RatioExample>
        </Ratio>
      </Ratios>
    </>
  );
};

const Title = tw.div``;
const Ratios = tw.div`flex flex-row justify-center`;
const Ratio = tw.button`flex flex-col items-center ml-4 mr-4`;
const RatioIcon = tw.div`w-4`;
const RatioDesc = tw.div`hidden lg:block`;
const RatioExample = tw.div`w-12 lg:w-full`;
const RatioTitle = tw.div`font-bold`;
