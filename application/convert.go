package main

import (
	"log"
	"os/exec"
	"path/filepath"
)

func ConvertVideo(sourceVideo,
	outFileDir,
	webcamW,
	webcamH,
	webcamX,
	webcamY,
	sceneW,
	sceneH,
	sceneX,
	sceneY,
	startTime,
	endTime string,
) (string, error) {
	outFile := filepath.Join(outFileDir, "converted_"+filepath.Base(sourceVideo))
	if webcamH == "0" && webcamX == "0" {
		cmd := exec.Command("ffmpeg",
			"-y",
			"-i", sourceVideo,
			"-filter:v",
			"crop="+sceneW+":"+sceneH+":"+sceneX+":"+sceneY+",scale=720:-2",
		)
		if startTime != "" {
			cmd.Args = append(cmd.Args, "-ss", startTime)
			if endTime != "" {
				cmd.Args = append(cmd.Args, "-to", endTime)
			}
		}
		// output file needs to be last arg
		cmd.Args = append(cmd.Args, outFile)

		log.Println("Running", cmd.String())

		err := cmd.Run()
		if err != nil {
			panic(err)
		}
		return outFile, nil
	} else {
		cmd := exec.Command("ffmpeg",
			"-y",
			"-i", sourceVideo,
			"-filter_complex:v",
			"[0:v]crop="+webcamW+":"+webcamH+":"+webcamX+":"+webcamY+",scale=720:-2[out1];[0:v]crop="+sceneW+":"+sceneH+":"+sceneX+":"+sceneY+",scale=720:-2[out2];[out1][out2]vstack",
		)
		if startTime != "" {
			cmd.Args = append(cmd.Args, "-ss", startTime)
			if endTime != "" {
				cmd.Args = append(cmd.Args, "-to", endTime)
			}
		}
		// output file needs to be last arg
		cmd.Args = append(cmd.Args, outFile)

		log.Println("Running", cmd.String())

		err := cmd.Run()
		if err != nil {
			panic(err)
		}
		return outFile, nil
	}
}
