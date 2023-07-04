import React, { ChangeEvent, useState, useEffect } from "react";
import tw, { styled } from "twin.macro";
import Image from "next/image";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Distributor } from "../../components/distributor/distributor";
import { useRouter } from "next/router";
import { faLongArrowAltRight } from "@fortawesome/free-solid-svg-icons";

export default function Clip() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <Content>
      <Upper>
        <UpperContent>
          <Header>
            <VerticlipLogo>
              <Link href={"/"}>
                <a>
                  <Image
                    src={"/VerticlipLogo.svg"}
                    height={1}
                    width={3}
                    layout={"responsive"}
                  />
                </a>
              </Link>
            </VerticlipLogo>
            <LearnMore>
              <LearnMoreDesc>
                <a
                  target={"_blank"}
                  href={"https://pipeline.gg"}
                  onClick={() => {
                    return true;
                  }}
                >
                  Learn to stream with Pipeline{" "}
                  <Icon icon={faLongArrowAltRight} />
                </a>
              </LearnMoreDesc>
            </LearnMore>
          </Header>
          <Outer>
            <ClipPoller>
              <Distributor id={slug as string} />
            </ClipPoller>
          </Outer>
        </UpperContent>
      </Upper>
    </Content>
  );
}

/* General */
const Icon = tw(FontAwesomeIcon)``;

/* Outer Layer Css */
const Content = tw.div`h-screen bg-vertipurp bg-gradient-radial-top-left-bottom-right`;

/* VertiClip Section */
// Layout
const Upper = tw.div``;
const UpperContent = tw.div`w-full lg:w-2/3 m-auto pt-8`;

// Header
const Header = tw.div`flex items-center justify-between mx-4 lg:m-auto`;
const LearnMore = tw.div`block ml-2 lg:mr-8`;
const VerticlipLogo = tw.div`block w-1/2 lg:w-1/4 hover:cursor-pointer`;

// LearnMore
const LearnMoreDesc = tw.div`hover:cursor-pointer text-white`;

// Hero Section
const Outer = tw.div`flex flex-row items-center justify-center text-center lg:px-10 h-full `;
const ClipPoller = tw.div`flex items-center justify-center h-44 lg:h-72 bg-white rounded-lg w-5/6 mt-10`;
