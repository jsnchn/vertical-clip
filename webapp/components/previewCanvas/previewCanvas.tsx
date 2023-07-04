import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import tw from "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import start from "next/dist/server/lib/start-server";
import dynamic from "next/dynamic";
import { Rectangle } from "../clipperFlow/clipperFlow";

export interface PreviewCanvasProps {
  videoSource: string;
  rect: Rectangle;
  clipmode: ClipMode;
  ratio: number;
}

type Coordinate = {
  x: number;
  y: number;
};
enum RectMode {
  CAM4BY3,
  CAM16BY9,
  GAME,
}

enum ClipMode {
  FULLSCREEN,
  SPLIT4BY3,
  SPLIT16BY9,
}
export const PreviewCanvas = ({
  videoSource,
  rect,
  clipmode,
  ratio,
}: PreviewCanvasProps) => {
  let canvasRef = useRef<HTMLCanvasElement>(null);
  let videoRef = useRef<HTMLVideoElement>(null);
  const getMultiplier = (rectAsp: RectMode | undefined) => {
    switch (rectAsp) {
      case RectMode.CAM4BY3:
        return 3 / 4;
        break;
      case RectMode.GAME:
        let multiplier = 1;
        switch (clipmode) {
          case ClipMode.FULLSCREEN:
            multiplier = 0;
            break;
          case ClipMode.SPLIT4BY3:
            multiplier = 3 / 4;
            break;
          case ClipMode.SPLIT16BY9:
            multiplier = 9 / 16;
            break;
          default:
            multiplier = 9 / 16;
            break;
        }
        return (1280 - 720 * multiplier) / 720;
      case RectMode.CAM16BY9:
        return 9 / 16;
        break;
      default:
        return 0;
    }
  };
  const [posOffset, setPosOffset] = useState<Coordinate>({ x: 0, y: 0 });

  const draw = () => {
    let canvas = canvasRef.current;
    let video = videoRef.current;
    if (canvas == null) return;
    if (video == null) return;
    if (canvas !== null) {
      let context = canvas.getContext("2d");
      if (canvas != null) {
        if (video != null && context != null) {
          let vw = video.videoWidth || video.width; // these are on video element itself
          let vh = video.videoHeight || video.height; // these are on video element itself
          if (video.paused || video.ended) {
            return;
          }
          const canvRatio = vw / canvas.clientWidth;

          const wM = getMultiplier(rect.mode);
          const wX = rect.pos.x * ratio * canvRatio;
          const wY = rect.pos.y * ratio * canvRatio;
          const wW = rect.width * ratio * canvRatio;
          const wH = rect.width * wM * canvRatio;
          canvas.width = wW;
          canvas.height = wH;
          console.log(wH);
          context.drawImage(
            video,
            wX,
            wY,
            wW,
            wH,
            0,
            0,
            vw / ratio,
            vh / ratio
          );
        }
      }
    }
  };
  const [videoPlaying, setVideoPlaying] = useState(0);

  useEffect(() => {
    requestAnimationFrame(() => draw());
  }, [videoPlaying]);

  useEffect(() => {
    let canvas = canvasRef.current;
    let video = videoRef.current;
    if (canvas == null) return;
    if (video == null) return;
    if (canvas !== null) {
      if (canvas != null) {
        const canvasRect = canvas.getBoundingClientRect();
        if (video) {
          let vw: number;
          let vh: number;

          video.addEventListener(
            "loadedmetadata",
            function () {
              vw = this.videoWidth || this.width; // these are on video element itself
              vh = this.videoHeight || this.height;
              if (canvas != null) {
              }
            },
            false
          );

          /* Draw Function and adding the Listener to Canvas */
          video.addEventListener("play", () => {
            let frame = 0;
            const interval = setInterval(() => {
              setVideoPlaying(frame);
              frame += 1;
              if (frame == 60) {
                frame = 0;
              }
            }, 1000 / 30);
            return () => clearInterval(interval);
          });

          /* Rectangle Move Function and listener */
        }
      }
    }
  }, []);

  return (
    <Container>
      <video
        loop
        autoPlay={true}
        ref={videoRef}
        src={videoSource}
        className={"hidden"}
      />
      <canvas
        ref={canvasRef}
        className={"block w-full lg:w-3/4 mx-2 lg:mx-8 "}
      ></canvas>
    </Container>
  );
};
const Container = tw.div`flex flex-col items-center`;
