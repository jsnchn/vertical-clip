import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import tw from "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import start from "next/dist/server/lib/start-server";
import dynamic from "next/dynamic";

export interface VideoCanvasProps {
  videoSource: string;
  rectAsp?: RectMode;
  setParentRect: (
    mode: RectMode,
    width: number,
    coordinate: Coordinate
  ) => void;
  nextStep: () => void;
  rectStart?: Coordinate;
  setRatio: (ratio: number) => void;
  clipmode?: ClipMode;
}

enum ClipMode {
  FULLSCREEN,
  SPLIT4BY3,
  SPLIT16BY9,
}

enum RectMode {
  CAM4BY3,
  CAM16BY9,
  GAME,
}

type Coordinate = {
  x: number;
  y: number;
};

export const VideoCanvas = ({
  videoSource,
  rectAsp,
  setParentRect,
  rectStart,
  setRatio,
  clipmode,
}: VideoCanvasProps) => {
  const thresholdPx = 5;
  let canvasRef = useRef<HTMLCanvasElement>(null);
  let videoRef = useRef<HTMLVideoElement>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [isResize, setIsResize] = useState(false);
  const [moveDirection, setMoveDirection] = useState<"vertical" | "horizontal">(
    "horizontal"
  );
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
  const [rect, setRect] = useState({
    coordinate: rectStart ?? ({ x: 0, y: 0 } as Coordinate),
    width: 200,
    multiplier: getMultiplier(rectAsp),
  });
  const [posOffset, setPosOffset] = useState<Coordinate>({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState<Coordinate>({
    x: 0,
    y: 0,
  });
  useEffect(() => {
    setRect((prevState) => ({
      ...prevState,
      multiplier: getMultiplier(rectAsp),
    }));
  }, [rectAsp]);
  useEffect(() => {
    setRect((prevState) => ({
      ...prevState,
      multiplier: getMultiplier(rectAsp),
    }));
  }, []);
  const startMoveRect = useCallback(
    (ev: MouseEvent | TouchEvent) => {
      const coordinates = getCoordinates(ev);
      setMousePosition(coordinates as Coordinate);
      if (coordinates) {
        // resize rect
        if (
          (coordinates.y < rect.coordinate.y + thresholdPx &&
            coordinates.y > rect.coordinate.y - thresholdPx) ||
          (coordinates.y <
            rect.coordinate.y + rect.width * rect.multiplier + thresholdPx &&
            coordinates.y >
              rect.coordinate.y + rect.width * rect.multiplier - thresholdPx)
        ) {
          setMoveDirection("vertical");
        } else if (
          (coordinates.x < rect.coordinate.x + thresholdPx &&
            coordinates.x > rect.coordinate.x - thresholdPx) ||
          (coordinates.x < rect.coordinate.x + rect.width + thresholdPx &&
            coordinates.x > rect.coordinate.x + rect.width - thresholdPx)
        ) {
          setMoveDirection("horizontal");
        }
        if (
          (coordinates.x < rect.coordinate.x + thresholdPx &&
            coordinates.x > rect.coordinate.x - thresholdPx) ||
          (coordinates.x < rect.coordinate.x + rect.width + thresholdPx &&
            coordinates.x > rect.coordinate.x + rect.width - thresholdPx) ||
          (coordinates.y < rect.coordinate.y + thresholdPx &&
            coordinates.y > rect.coordinate.y - thresholdPx) ||
          (coordinates.y <
            rect.coordinate.y + rect.width * rect.multiplier + thresholdPx &&
            coordinates.y >
              rect.coordinate.y + rect.width * rect.multiplier - thresholdPx)
        ) {
          setIsResize(true);
        }
        // move rect
        else if (
          coordinates.x > rect.coordinate.x &&
          coordinates.x < rect.coordinate.x + rect.width
        ) {
          if (
            coordinates.y > rect.coordinate.y &&
            coordinates.y < rect.coordinate.y + rect.width * rect.multiplier
          ) {
            const xDiff = coordinates.x - rect.coordinate.x;
            const yDiff = coordinates.y - rect.coordinate.y;
            setPosOffset({ x: xDiff, y: yDiff });
            setIsMoving(true);
          }
        }
      }
    },
    [isMoving, isResize]
  );
  const endMoveRect = (ev: MouseEvent | TouchEvent) => {
    setIsMoving(false);
    setIsResize(false);
  };
  const moveRect = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!canvasRef.current) {
        return;
      }
      // cursor styles
      const coordinates = getCoordinates(e);
      if (!coordinates) {
        return;
      }
      const rectHeight = rect.width * rect.multiplier;
      if (
        (coordinates.y < rect.coordinate.y + thresholdPx &&
          coordinates.y > rect.coordinate.y - thresholdPx) ||
        (coordinates.y < rect.coordinate.y + rectHeight + thresholdPx &&
          coordinates.y > rect.coordinate.y + rectHeight - thresholdPx)
      ) {
        canvasRef.current.style.cursor = "ns-resize";
      } else if (
        (coordinates.x < rect.coordinate.x + thresholdPx &&
          coordinates.x > rect.coordinate.x - thresholdPx) ||
        (coordinates.x < rect.coordinate.x + rect.width + thresholdPx &&
          coordinates.x > rect.coordinate.x + rect.width - thresholdPx)
      ) {
        canvasRef.current.style.cursor = "ew-resize";
      } else if (
        coordinates.y > rect.coordinate.y &&
        coordinates.y < rect.coordinate.y + rect.width * rect.multiplier &&
        coordinates.x > rect.coordinate.x &&
        coordinates.x < rect.coordinate.x + rect.width
      ) {
        canvasRef.current.style.cursor = "move";
      } else {
        canvasRef.current.style.cursor = "default";
      }
      if (!isMoving && !isResize) {
        return;
      }
      if (isResize) {
        const coordinate = getCoordinates(e);
        if (coordinate) {
          let dx = 0;
          if (moveDirection == "horizontal") {
            // v Growing to East v
            if (coordinate.x > rect.coordinate.x + rect.width) {
              dx = coordinate.x - rect.coordinate.x;
              if (rect.coordinate.x + dx > canvasRef.current.width) {
                dx = canvasRef.current.width - rect.coordinate.x;
              } else if (
                rect.coordinate.y + dx * rect.multiplier >
                canvasRef.current.height
              ) {
                dx =
                  (canvasRef.current.height - rect.coordinate.y) /
                  rect.multiplier;
              }

              setRect((prevState) => ({
                ...prevState,
                width: dx,
              }));
              // v Growing to West v
            } else if (coordinate.x < rect.coordinate.x) {
              dx = rect.coordinate.x + rect.width - coordinate.x;
              if (coordinate.x < 0) {
                coordinate.x = 0;
              }
              if (rect.coordinate.x + dx > canvasRef.current.width) {
                dx = canvasRef.current.width - rect.coordinate.x;
              }
              if (
                rect.coordinate.y + dx * rect.multiplier >
                canvasRef.current.height
              ) {
                dx =
                  (canvasRef.current.height - rect.coordinate.y) /
                  rect.multiplier;
              } else {
                setRect((prevState) => ({
                  ...prevState,
                  coordinate: { x: coordinate.x, y: rect.coordinate.y },
                  width: dx,
                }));
              }
              // v Shrinking v
            } else if (
              coordinate.x > rect.coordinate.x &&
              coordinate.x < rect.coordinate.x + rect.width
            ) {
              const dToO = coordinate.x - rect.coordinate.x;
              const dToE = rect.coordinate.x + rect.width - coordinate.x;

              dx = Math.min(dToO, dToE);
              // v To East v
              if (dToO > dToE) {
                setRect((prevState) => ({
                  ...prevState,
                  width: rect.width - dx,
                }));
                // v To West v
              } else if (dToO < dToE) {
                if (coordinate.x < 0) {
                  coordinate.x = 0;
                }
                setRect((prevState) => ({
                  ...prevState,
                  coordinate: { x: coordinate.x, y: rect.coordinate.y },
                  width: rect.width - dx,
                }));
              }
            }
          } else if (moveDirection == "vertical") {
            let dy = 0;
            if (
              rect.coordinate.y < coordinate.y &&
              rect.coordinate.y + rect.width * rect.multiplier > coordinate.y
            ) {
              const dToO = coordinate.y - rect.coordinate.y;
              const dToE =
                rect.coordinate.y + rect.width * rect.multiplier - coordinate.y;

              dy = Math.min(dToO, dToE);
              if (dToO < dToE) {
                setRect((prevState) => ({
                  ...prevState,
                  coordinate: { x: rect.coordinate.x, y: coordinate.y },
                  width: rect.width - dy,
                }));
              } else if (dToO > dToE) {
                setRect((prevState) => ({
                  ...prevState,
                  width: rect.width - dy,
                }));
              }
            } else if (rect.coordinate.y > coordinate.y) {
              let dy = rect.coordinate.y - coordinate.y;
              if (
                rect.coordinate.x + rect.width + dy > canvasRef.current.width ||
                rect.coordinate.y + (rect.width + dy) * rect.multiplier >
                  canvasRef.current.height
              ) {
                dy = 0;
              }
              if (dy > 0) {
                setRect((prevState) => ({
                  ...prevState,
                  width: rect.width + dy,
                  coordinate: { x: rect.coordinate.x, y: coordinate.y },
                }));
              }
            } else if (
              rect.coordinate.y + rect.width * rect.multiplier <
              coordinate.y
            ) {
              let dy =
                coordinate.y -
                (rect.coordinate.y + rect.width * rect.multiplier);
              if (
                rect.coordinate.x + rect.width + dy >
                canvasRef.current.width
              ) {
                dy = 0;
              }
              setRect((prevState) => ({
                ...prevState,
                width: rect.width + dy,
              }));
            }
          }
        }
        //requestAnimationFrame(draw);
      }

      if (isMoving) {
        const coordinate = getCoordinates(e);
        if (coordinate) {
          coordinate.x -= posOffset.x;
          coordinate.y -= posOffset.y;
          if (coordinate.x < 0) {
            coordinate.x = 0;
          }
          if (coordinate.x + rect.width > canvasRef.current.width) {
            coordinate.x = canvasRef.current.width - rect.width;
          }
          if (coordinate.y < 0) {
            coordinate.y = 0;
          }
          if (
            coordinate.y + rect.width * rect.multiplier >
            canvasRef.current.height
          ) {
            coordinate.y =
              canvasRef.current.height - rect.width * rect.multiplier;
          }
        }

        setRect((prevState) => ({
          ...prevState,
          coordinate: coordinate as Coordinate,
        }));
        //requestAnimationFrame(draw);
      }
    },
    [rect, isMoving, isResize]
  );

  const draw = () => {
    let canvas = canvasRef.current;
    let video = videoRef.current;
    let ratio: number;
    if (canvas == null) return;
    if (video == null) return;
    if (canvas !== null) {
      let context = canvas.getContext("2d");
      if (canvas != null) {
        if (video != null && context != null) {
          let vw = video.videoWidth || video.width; // these are on video element itself
          let vh = video.videoHeight || video.height; // these are on video element itself
          ratio = vw / canvas.clientWidth;
          if (video.paused || video.ended) {
            return;
          }
          setRatio(ratio);
          context.drawImage(video, 0, 0, vw / ratio, vh / ratio);
          context.fillStyle = "rgba(225,225,225,0.5)";
          context.fillRect(
            rect.coordinate.x,
            rect.coordinate.y,
            rect.width,
            rect.width * rect.multiplier
          );
        }
      }
    }
  };
  const [videoPlaying, setVideoPlaying] = useState(0);

  useEffect(() => {
    requestAnimationFrame(() => draw());
    setParentRect(
      rectAsp ? rectAsp : RectMode.CAM4BY3,
      rect.width,
      rect.coordinate
    );
  }, [videoPlaying]);

  useEffect(() => {
    let canvas = canvasRef.current;
    let video = videoRef.current;
    let ratio: number;
    if (canvas == null) return;
    if (video == null) return;
    if (canvas !== null) {
      if (canvas != null) {
        const canvasRect = canvas.getBoundingClientRect();
        setRect((prevState) => ({
          ...prevState,
          width: canvasRect ? canvasRect.width / 4 : 200,
        }));
        if (video) {
          let vw: number;
          let vh: number;

          video.addEventListener(
            "loadedmetadata",
            function () {
              vw = this.videoWidth || this.width; // these are on video element itself
              vh = this.videoHeight || this.height;
              if (canvas != null) {
                ratio = vw / canvas.clientWidth;
                canvas.width = vw / ratio;
                canvas.height = vh / ratio;
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
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener("mousedown", startMoveRect);
    canvas.addEventListener("mousemove", moveRect);
    canvas.addEventListener("mouseup", endMoveRect);
    //canvas.addEventListener("mouseout", cancelEventHandler);

    canvas.addEventListener("touchstart", startMoveRect);
    canvas.addEventListener("touchmove", moveRect);
    canvas.addEventListener("touchend", endMoveRect);
    //canvas.addEventListener("touchcancel", cancelEventHandler);
    return () => {
      canvas.removeEventListener("mousedown", startMoveRect);
      canvas.removeEventListener("mousemove", moveRect);
      canvas.removeEventListener("touchmove", moveRect);
      canvas.removeEventListener("touchstart", startMoveRect);

      canvas.removeEventListener("mouseup", endMoveRect);
    };
  }, [moveRect]);

  const getCoordinates = (
    event: MouseEvent | TouchEvent
  ): Coordinate | undefined => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    if (event instanceof MouseEvent) {
      let boundRect = canvas.getBoundingClientRect();
      return {
        x: event.pageX - boundRect.left,
        y: event.pageY - boundRect.top - window.pageYOffset,
      } as Coordinate;
    }
    if (event instanceof TouchEvent) {
      event.preventDefault();
      let boundRect = canvas.getBoundingClientRect();
      return {
        x: event.touches[0].pageX - boundRect.left,
        y: event.touches[0].pageY - boundRect.top - window.pageYOffset,
      } as Coordinate;
    }
    return {
      x: 0,
      y: 0,
    } as Coordinate;
  };

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
        className={"block w-full lg:w-3/4 m-2 lg:m-8"}
      ></canvas>
    </Container>
  );
};
const Container = tw.div`flex flex-col items-center`;
