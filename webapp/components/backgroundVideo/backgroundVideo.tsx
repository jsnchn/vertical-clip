import React, {useEffect, useRef} from 'react';
import Image from "next/image";
import tw from "twin.macro";

type Props ={
    videoUrl: string;
    fallbackImgUrl: string;
}

export const BackgroundVideo: React.FC<Props> = ({videoUrl, fallbackImgUrl}) => {
    const videoRef = useRef(null);

    useEffect(() => {
        //@ts-ignore
        videoRef.current.play()
    }, []);

    return (
        <Video
            ref={videoRef}
            loop
            muted
            poster={fallbackImgUrl}
        >
            <source src={videoUrl} type="video/webm" />
        </Video>
    )
}

const Video = tw.video`max-w-102`;