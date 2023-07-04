import tw, { styled } from "twin.macro";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { Loading } from "../loading/loading";
import Link from "next/link";

export interface DistributorProps {
  id: string;
}

type Poll = {
  pollCount: number;
  rate: number;
};

type Status = {
  type: Stati | undefined;
  message: string;
};

enum Stati {
  Error,
  Pending,
  Completed,
}

export const Distributor = ({ id }: DistributorProps) => {
  let polling: Poll = { pollCount: 0, rate: 1000 };
  const [status, setStatus] = useState<Status>({
    type: undefined,
    message: "",
  } as Status);
  const [statusTrackerFired, setStatusTrackerFired] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  let requestOptions = {
    method: "GET",
    redirect: "follow",
  } as RequestInit;
  const size = 256;
  useEffect(() => {
    if (id != "") {
      const interval = setInterval(() => {
        polling.pollCount += 1;
        fetch(
          `https://api.verticlip.pipeline.gg/api/v1/video/${id}`,
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => {
            const res = JSON.parse(result);
            switch (res.Status) {
              case 0:
                setStatus({
                  type: Stati.Pending,
                  message: "Your VertiClip is currently being rendered...",
                });
                break;
              case 1:
                setStatus({
                  type: Stati.Completed,
                  message: "Your Verticlip is Ready!",
                });
                setStatusTrackerFired(false);
                break;
              case -1:
                setStatus({
                  type: Stati.Error,
                  message:
                    "Sorry Streamer, but your clip is in another castle.",
                });
                setStatusTrackerFired(false);
            }
            if (res.Url != "") {
              setDownloadUrl(res.Url);
            }
          })
          .catch((error) => console.log("error", error));
      }, polling.rate);
      if (status.type == Stati.Error || status.type == Stati.Completed)
        clearInterval(interval);
      return () => clearInterval(interval);
    }
  }, [id, status]);

  useEffect(() => {
    if (!statusTrackerFired) {
      if (status.type == Stati.Error) {
        setStatusTrackerFired(true);
      } else if (status.type == Stati.Pending) {
        setStatusTrackerFired(true);
      } else if (status.type == Stati.Completed) {
        setStatusTrackerFired(true);
      }
    }
  }, [statusTrackerFired, status]);

  if (
    (downloadUrl == "" || downloadUrl == undefined) &&
    status.type == undefined
  ) {
    return (
      <Container>
        <Loading />
        <Description>Sending Data...</Description>
      </Container>
    );
  }
  if (status.type == Stati.Error) {
    return (
      <Container>
        <ErrorMessage>
          <Icon icon={faExclamationCircle}></Icon> {status.message}
        </ErrorMessage>
      </Container>
    );
  }
  if (status.type == Stati.Pending) {
    return (
      <Container>
        <ErrorMessage>
          <Icon icon={faExclamationCircle}></Icon> {status.message}
        </ErrorMessage>
        <span>Use this time to stretch!</span>
        <span>Check back later with one of these:</span>
        <QRandButton>
          <a href={"/clip/" + id + "?mode=Link"} onClick={() => {}}>
            <Button>Get my Download Link</Button>
          </a>
          <QRCodeContainer>
            <QRCodeImage
              src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${
                window.location.href + "clip/" + id + "?mode=QR"
              }`}
              size={size}
              show={true}
            />
          </QRCodeContainer>
        </QRandButton>
      </Container>
    );
  }
  if (status.type == Stati.Completed) {
    return (
      <Container>
        <Redeem>
          <Title>Your Verticlip is Ready!</Title>
          <Subtitle>
            Thank you for using Verticlip by Pipeline. Download your clip below.
          </Subtitle>
          <QRandButton>
            <div>
              <VideoContainer>
                <video controls={true} loop src={downloadUrl} />
              </VideoContainer>
              <a href={downloadUrl} onClick={() => {}}>
                <Button>Download my clip</Button>
              </a>
            </div>
            <QRCodeContainer>
              <QRCodeImage
                src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${
                  window.location.href + "clip/" + id
                }`}
                size={size}
                show={downloadUrl != ""}
              />
            </QRCodeContainer>
          </QRandButton>
        </Redeem>
      </Container>
    );
  }
  return <Container>Unknown Error</Container>;
};

const Container = styled.div`
  ${tw`flex flex-col justify-center items-center mx-auto w-full h-44`}
`;
const QRCodeImage = styled.img<{ props: any }>`
  width: ${(props: any) => props.size};
  height: ${(props: any) => props.size};
  ${(props: any) => (props.show ? tw`` : tw`hidden`)}
`;
const VideoContainer = tw.div`hidden lg:block w-16 m-auto mb-2`;
const QRCodeContainer = tw.div`hidden lg:block`;
const Redeem = tw.div``;
const Icon = tw(FontAwesomeIcon)``;
const Description = tw.div`text-center text-heading-3`;
const ErrorMessage = tw.div`text-center text-heading-5 lg:text-heading-4`;
const QRandButton = tw.div`flex flex-row items-center mt-4 justify-center`;
const Title = tw.div`text-center text-heading-2 mt-4`;
const Subtitle = tw.div`text-center text-heading-5 mt-2`;
const Button = tw.button`rounded-lg bg-gradient-to-r from-flameorange-1 to-flameorange-2 font-sans text-white p-2 mx-4`;
