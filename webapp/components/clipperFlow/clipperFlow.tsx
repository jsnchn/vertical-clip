import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import tw from "twin.macro";
import { StepNav } from "../stepNav/stepNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { VideoCanvas } from "../videoCanvas/videoCanvas";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { SelectRatio } from "../selectRatio/selectRatio";
import { Distributor } from "../distributor/distributor";
import { PreviewCanvas } from "../previewCanvas/previewCanvas";

export interface ClipperFlowProps {
  videoId: string;
  close: () => void;
  videoFile?: File;
}

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
export interface Rectangle {
  pos: Coordinate;
  width: number;
  mode: RectMode;
}
type Coordinate = {
  x: number;
  y: number;
};
export const ClipperFlow = ({
  videoId,
  close,
  videoFile,
}: ClipperFlowProps) => {
  const [backendID, setBackEndID] = useState("");
  const [step, setStep] = useState<number>(0);
  const [webcamRect, setWebcamRect] = useState<Rectangle>({
    pos: { x: 0, y: 0 },
    width: 200,
    mode: RectMode.CAM16BY9,
  });
  const [gameRect, setGameRect] = useState<Rectangle>({
    pos: { x: 0, y: 0 },
    width: 200,
    mode: RectMode.GAME,
  });
  const [mode, setMode] = useState<ClipMode>();
  const [canvasRatio, setCanvasRatio] = useState<number>(1.0);

  const ratioSetter = (ratio: number) => {
    setCanvasRatio(ratio);
  };
  const modeSetter = (ratio: "split" | "fullscreen") => {
    if (ratio == "split") {
      setMode(ClipMode.SPLIT16BY9);
      setWebcamRect((prevState) => ({
        ...prevState,
        mode: RectMode.CAM16BY9,
      }));
      setStep(2);
    } else {
      setMode(ClipMode.FULLSCREEN);
      setWebcamRect((prevState: Rectangle) => ({
        ...prevState,
        width: 0,
      }));
      setStep(3);
    }
  };
  const getMultiplier = (rectAsp: RectMode | undefined) => {
    switch (rectAsp) {
      case RectMode.CAM4BY3:
        return 3 / 4;
        break;
      case RectMode.GAME:
        let multiplier = 1;
        switch (mode) {
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
        break;
      case RectMode.CAM16BY9:
        return 9 / 16;
        break;
      default:
        return 0;
    }
  };
  const stepSetter = (step: number) => {
    setStep(step);
  };

  useEffect(() => {
    if (step > 6) setStep(0);
  }, [step]);

  const setRect = (inmode: RectMode, width: number, coordinate: Coordinate) => {
    switch (inmode) {
      case RectMode.CAM4BY3:
        if (mode != ClipMode.FULLSCREEN) {
          setMode(ClipMode.SPLIT4BY3);
        }
        setWebcamRect({ pos: coordinate, width: width, mode: inmode });
        break;
      case RectMode.CAM16BY9:
        if (mode != ClipMode.FULLSCREEN) {
          setMode(ClipMode.SPLIT16BY9);
        }
        setWebcamRect({ pos: coordinate, width: width, mode: inmode });
        break;
      case RectMode.GAME:
        setGameRect({ pos: coordinate, width: width, mode: inmode });
        break;
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };
  const sendData = () => {
    console.log("sending data...");
    if (mode == ClipMode.FULLSCREEN) {
      setWebcamRect((prevState: Rectangle) => ({
        ...prevState,
        width: 0,
      }));
    }
    let formdata = new FormData();
    if (videoFile) {
      var fileOfBlob = new File([videoFile], videoFile.name);
      formdata.append("sourceVideo", fileOfBlob, videoFile.name);
    } else {
      formdata.append("url", videoId);
    }
    formdata.append(
      "wc_w",
      (Math.round((webcamRect.width * canvasRatio) / 2) * 2).toString()
    );
    formdata.append(
      "wc_h",
      (
        Math.round(
          (webcamRect.width * getMultiplier(webcamRect.mode) * canvasRatio) / 2
        ) * 2
      ).toString()
    );
    formdata.append(
      "wc_x",
      (Math.round((webcamRect.pos.x * canvasRatio) / 2) * 2).toString()
    );
    formdata.append(
      "wc_y",
      (Math.round((webcamRect.pos.y * canvasRatio) / 2) * 2).toString()
    );
    formdata.append(
      "s_w",
      (Math.round((gameRect.width * canvasRatio) / 2) * 2).toString()
    );

    formdata.append(
      "s_h",
      (
        Math.round(
          (gameRect.width * getMultiplier(gameRect.mode) * canvasRatio) / 2
        ) * 2
      ).toString()
    );
    formdata.append(
      "s_x",
      (Math.round((gameRect.pos.x * canvasRatio) / 2) * 2).toString()
    );
    formdata.append(
      "s_y",
      (Math.round((gameRect.pos.y * canvasRatio) / 2) * 2).toString()
    );

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    } as RequestInit;
    if (videoFile) {
      fetch(
        "https://api.verticlip.pipeline.gg/api/v1/process/upload",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          const res = JSON.parse(result);
          setBackEndID(res.videoId);
        })
        .catch((error) => console.log("error", error));
    } else {
      fetch(
        "https://api.verticlip.pipeline.gg/api/v1/process/twitch",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          const res = JSON.parse(result);
          setBackEndID(res.videoId);
        })
        .catch((error) => console.log("error", error));
    }
  };
  return (
    <Container>
      <StepNav step={step} />
      {{
        // Is this the right clip?
        0: (
          <div>
            <VideoCanvas
              videoSource={videoId}
              setParentRect={setRect}
              nextStep={nextStep}
              rectAsp={undefined}
              setRatio={setCanvasRatio}
            />
            <Continue>
              <Confirm
                onClick={() => {
                  setStep(1);
                }}
              >
                Yes, Continue <Icon icon={faArrowRight} />
              </Confirm>
              <Deny
                onClick={() => {
                  close();
                }}
              >
                Nope, Go Back
              </Deny>
            </Continue>
          </div>
        ),
        // Chose your Aspect Ratio :)
        1: (
          <div>
            <SelectRatio setRatio={modeSetter} />
          </div>
        ),
        2: (
          <div>
            <VideoCanvas
              key={"webcam"}
              videoSource={videoId}
              setParentRect={setRect}
              nextStep={nextStep}
              rectAsp={webcamRect.mode}
              setRatio={setCanvasRatio}
              clipmode={mode}
            />
            <Continue>
              <ChangeAspect
                onClick={() => {
                  setWebcamRect((prevState: Rectangle) => ({
                    ...prevState,
                    mode:
                      prevState.mode == RectMode.CAM4BY3
                        ? RectMode.CAM16BY9
                        : RectMode.CAM4BY3,
                  }));
                  switch (webcamRect.mode) {
                    case RectMode.CAM16BY9:
                      setMode(ClipMode.SPLIT16BY9);
                      break;
                    case RectMode.CAM4BY3:
                      setMode(ClipMode.SPLIT4BY3);
                      break;
                    default:
                      setMode(ClipMode.FULLSCREEN);
                  }
                }}
              >
                {webcamRect?.mode == RectMode.CAM4BY3
                  ? "Switch to 16 by 9"
                  : "Switch to 4 by 3"}
              </ChangeAspect>
              <Confirm
                onClick={() => {
                  setStep(3);
                }}
              >
                Next <Icon icon={faArrowRight} />
              </Confirm>
            </Continue>
          </div>
        ),
        3: (
          <div>
            <VideoCanvas
              key={"game"}
              videoSource={videoId}
              setParentRect={setRect}
              nextStep={nextStep}
              rectAsp={gameRect.mode}
              rectStart={{ x: 0, y: 0 } as Coordinate}
              clipmode={mode}
              setRatio={setCanvasRatio}
            />
            <Continue>
              <Confirm
                onClick={() => {
                  setStep(5);

                  sendData();
                }}
              >
                Next <Icon icon={faArrowRight} />
              </Confirm>
            </Continue>
          </div>
        ),
        4: (
          <div>
            {/*wc_w = {webcamRect.width * canvasRatio}*/}
            {/*<br />*/}
            {/*wc_h ={" "}*/}
            {/*{webcamRect.width * getMultiplier(webcamRect.mode) * canvasRatio}*/}
            {/*/!*<br />*!/*/}
            {/*/!*wc_x = {webcamRect.pos.x * canvasRatio}*!/*/}
            {/*/!*<br />*!/*/}
            {/*/!*wc_y = {webcamRect.pos.y * canvasRatio}*!/*/}
            {/*<br />*/}
            {/*s_w = {gameRect.width * canvasRatio}*/}
            {/*<br />*/}
            {/*s_h ={" "}*/}
            {/*{gameRect.width * getMultiplier(webcamRect.mode) * canvasRatio}*/}
            {/*/!*<br />*!/*/}
            {/*/!*s_x = {gameRect.pos.x * canvasRatio}*!/*/}
            {/*/!*<br />*!/*/}
            {/*/!*s_y = {gameRect.pos.y * canvasRatio}*!/*/}
            {/*<br />*/}
            {/*mode: {mode == 0 ? "fullscreen" : "split"}*/}
            {/*<br />*/}
            {/*ratio: {canvasRatio}*/}
            {/*<br />*/}
            {/*source: {videoId}*/}
            {/*<br />*/}
            {/*videoFile: {videoFile ? videoFile.name : "none"}*/}
            <Preview>
              In the future there will be a preview here :)
              {/*/!*<PreviewCanvas*!/*/}
              {/*  // key={"cam"}*/}
              {/*  // rect={webcamRect}*/}
              {/*  // ratio={canvasRatio}*/}
              {/*  // videoSource={videoId}*/}
              {/*  // clipmode={mode ?? ClipMode.FULLSCREEN}*/}
              {/*/!*></PreviewCanvas>*!/*/}
              {/*/!*<PreviewCanvas*!/*/}
              {/*  // key={"game"}*/}
              {/*  // rect={gameRect}*/}
              {/*  // ratio={canvasRatio}*/}
              {/*  // videoSource={videoId}*/}
              {/*  // clipmode={mode ?? ClipMode.FULLSCREEN}*/}
              {/*/!*></PreviewCanvas>*!/*/}
            </Preview>
            <Continue>
              <Confirm
                onClick={() => {
                  setStep(5);
                  sendData();
                }}
              >
                Confirm
              </Confirm>
            </Continue>
          </div>
        ),
        5: (
          <div>
            <Distributor id={backendID} />
          </div>
        ),
      }[step as keyof {}] || <div>{step}</div>}
    </Container>
  );
};

const Container = tw.div``;
const Continue = tw.div`flex justify-center`;
const Confirm = tw.button`rounded-lg bg-gradient-to-r from-flameorange-1 to-flameorange-2 font-sans text-white p-2`;
const Icon = tw(FontAwesomeIcon)``;
const Deny = tw.button`ml-4 text-gray-1`;
const ChangeAspect = tw.button`rounded-lg bg-gray-2 text-black-natural p-2`;
const Preview = tw.div`my-20 text-center`;
