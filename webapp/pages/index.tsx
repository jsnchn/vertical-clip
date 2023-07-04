import React, { ChangeEvent, useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import tw, { styled } from "twin.macro";
import Image from "next/image";
import Link from "next/link";
import { InfoGridItem } from "../components/infoGridItem/infoGridItem";
import {
  faFileImport,
  faLongArrowAltRight,
  faCloudUploadAlt,
  faExpand,
  faClock,
  faVideo,
  faUsers,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "../components/modal/modal";
import { ClipperFlow } from "../components/clipperFlow/clipperFlow";
import { BackgroundVideo } from "../components/backgroundVideo/backgroundVideo";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });
  const [clipName, setClipName] = useState("");
  const [videoSourceUrl, setVideoSourceUrl] = useState("");
  const [videoFileObject, setVideoFileObject] = useState<File>();

  const clipInputChange = (e: any) => {
    const split = e.target.value.split("/");
    if (split[split.length - 1].length > 1) {
      setClipName(split[split.length - 1]);
    } else {
      setClipName(split[split.length - 2]);
    }
  };

  const clipInputClick = (e: any) => {
    if (clipName == "") {
      setError({
        visible: true,
        message: "Please enter a valid Twitch Clip URL.",
      });
      console.error(error);
    }
    try {
      fetch(`/api/twitchClip/${clipName}`).then(async (response: any) => {
        const data = await response.json();
        setVideoSourceUrl(data["data"]);
        setShowModal(true);
      });
    } catch (e) {
      console.error(e);
    }
  };

  function handleModalChange(value: boolean) {
    setShowModal(value);
    if (value == false) {
      setVideoFileObject(undefined);
      setVideoSourceUrl("");
    }
  }
  const uploadVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileSize = e.target.files[0].size / 1024 / 1024;
      if (fileSize > 80) {
        setError({
          visible: true,
          message: "Please chose a clip that is below 80 MB in size.",
        });
      } else {
        setVideoSourceUrl(URL.createObjectURL(e.target.files[0]));
        setVideoFileObject(e.target.files[0]);
        setShowModal(true);
      }
    }
    const ev = e.target as HTMLInputElement;
    ev.value = "";
  };
  return (
    <Content>
      <Modal show={showModal} onChange={handleModalChange}>
        <ClipperFlow
          videoId={videoSourceUrl}
          videoFile={videoFileObject}
          close={() => handleModalChange(false)}
        />
      </Modal>
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
          <Hero>
            <CTA>
              <CTAH1>
                Turn Your Clips <br />
                Into Viral Growth
              </CTAH1>
              <CTAH2>
                Convert your stream clips into vertical videos for Tiktok,{" "}
                <br />
                YouTube Shorts, and Reels in under 30 seconds.
              </CTAH2>
              <Actions>
                <ClipEntry>
                  <ClipInput
                    placeholder={"Paste Twitch Clip Url"}
                    onChange={(e: any) => clipInputChange(e)}
                  ></ClipInput>
                  <ClipButton onClick={(e: any) => clipInputClick(e)}>
                    <Icon icon={faExpand} className={"mr-1"} />
                    Convert
                  </ClipButton>
                </ClipEntry>
                <OrUpload>
                  <Or>or</Or>
                  <UploadLabel>
                    <UploadButton
                      type={"file"}
                      className={"hidden"}
                      accept={"video/mp4"}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        uploadVideoChange(e)
                      }
                    />
                    <Icon icon={faCloudUploadAlt} className={"mr-1"} />
                    Upload a Local File
                  </UploadLabel>
                </OrUpload>
              </Actions>
              <Error show={error.visible}>
                <Icon icon={faExclamationCircle} />
                {error.message}
              </Error>
            </CTA>
            <HeroImage>
              <BackgroundVideo
                videoUrl={"https://cdn.pipeline.gg/verticlip-hero.webm"}
                fallbackImgUrl={"/promo.png"}
              />
            </HeroImage>
          </Hero>
          <InfoGrid>
            <InfoGridTitle>
              Harness The Power Of <br />
              Short-Form Content
            </InfoGridTitle>
            <InfoGridItems>
              <InfoGridItem
                key={1}
                id={1}
                title={"Save more time"}
                desc={
                  "Now that you can create vertical videos in seconds, you're freed up to test more platforms and focus on creating more awesome content."
                }
                icon={faClock}
              />
              <InfoGridItem
                key={2}
                id={2}
                title={"Post more videos"}
                desc={
                  "Increase your video output and show your community every great moment that happens on stream."
                }
                icon={faVideo}
              />
              <InfoGridItem
                key={3}
                id={3}
                title={"Get more followers"}
                desc={
                  "TikTok, YouTube Shorts, and Instagram Reels are helping creators get discovered and build audiences faster than ever."
                }
                icon={faUsers}
              />
            </InfoGridItems>
          </InfoGrid>
        </UpperContent>
      </Upper>
      <Lower>
        <PipelineHero>
          <PipelineCTA></PipelineCTA>
          <PipelineImage></PipelineImage>
        </PipelineHero>
        <PipelineCR></PipelineCR>
      </Lower>
    </Content>
  );
}

/* General */
const Icon = tw(FontAwesomeIcon)``;

/* Outer Layer Css */
const Content = tw.div``;

/* VertiClip Section */
// Layout
// const Upper = tw.div`bg-gradient-radial-top-left-bottom-right`;
const Upper = tw.div`bg-vertipurp bg-gradient-radial-top-left-bottom-right`;
const UpperContent = tw.div`w-full lg:w-2/3 m-auto pt-8`;

// Header
const Header = tw.div`flex items-center lg:justify-between mx-4 lg:m-auto`;
const LearnMore = tw.div`block ml-2 lg:mr-8`;
const VerticlipLogo = tw.div`block w-1/2 lg:w-1/4 hover:cursor-pointer`;

// LearnMore
const LearnMoreDesc = tw.div`hover:cursor-pointer text-white`;

// Hero Section
const Hero = tw.div`flex lg:flex-row items-center lg:justify-between mt-2 px-3 lg:px-10`;
const CTA = tw.div`flex flex-col`;
const HeroImage = tw.div`hidden lg:block lg:w-2/5 overflow-hidden`;

// CTA
const CTAH1 = tw.span`font-sans text-heading-2 lg:text-heading-1 text-white font-extrabold`;
const CTAH2 = tw.span`font-sans text-heading-5 lg:text-heading-5 text-white mt-1`;
const Error = styled.div`
  ${tw`text-center w-full font-sans text-heading-5 text-white mt-4`}
  ${(props: any) => (props.show ? tw`` : tw`hidden`)}
`;
const Actions = tw.div`flex flex-col items-center`;
const ClipEntry = tw.div`flex flex-col lg:flex-row w-full mt-2 border border-transparent hover:border-white hover:rounded-lg shadow-xl`;
const ClipInput = tw.input`flex-grow p-2 rounded-lg rounded-b-none lg:rounded-b-lg lg:rounded-r-none`;
const ClipButton = tw.button`rounded-lg rounded-t-none lg:rounded-t-lg lg:rounded-l-none bg-gradient-to-r from-flameorange-1 to-flameorange-2 font-sans text-white p-1 lg:p-2`;
const OrUpload = tw.div`block m-auto mt-6`;
const Or = tw.div`inline-block text-white mr-2`;
const UploadLabel = tw.label`bg-dplue p-2 border rounded text-white border-dplue hover:border-white cursor-pointer`;
const UploadButton = tw.input``;

// Info Grid
const InfoGrid = tw.div`mx-4 lg:mx-0`;
const InfoGridTitle = tw.h1`text-heading-3 lg:text-heading-1 text-left lg:text-center text-white mt-6 font-sans`;
const InfoGridItems = tw.div`grid grid-cols-1 lg:grid-cols-3 gap-2 pb-2 mt-8 lg:gap-10 lg:pb-8`;

/* Pipeline Section */
// Layout
const Lower = tw.div``;

// Hero Section
const PipelineHero = tw.div``;
const PipelineCTA = tw.div``;

// Copyright Section
const PipelineImage = tw.div``;
const PipelineCR = tw.div``;
