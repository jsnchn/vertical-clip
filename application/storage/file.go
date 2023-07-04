package storage

import (
	"bytes"
	"log"
	"net/http"
	"os"
	"path"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/getsentry/sentry-go"
)

func (space *Space) Upload(filename string, id string) (string, error) {
	uploadPath := os.Getenv("DO_OBJECT_PREFIX") + "/" + id + "/" + path.Base(filename)
	file, err := os.Open(filename)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	fileInfo, _ := file.Stat()
	var size = fileInfo.Size()
	buffer := make([]byte, size)
	file.Read(buffer)

	object := s3.PutObjectInput{
		Bucket:             aws.String(os.Getenv("DO_BUCKET")),
		Key:                aws.String(uploadPath),
		ACL:                aws.String("public-read"),
		Body:               bytes.NewReader(buffer),
		ContentLength:      aws.Int64(size),
		ContentType:        aws.String(http.DetectContentType(buffer)),
		ContentDisposition: aws.String("attachment"),
	}

	_, err = space.Client.PutObject(&object)
	if err != nil {
		sentry.CaptureException(err)
		log.Println(err.Error())
		return "", err
	}
	downloadPath := os.Getenv("CDN_DOMAIN") + "/" + uploadPath
	return downloadPath, nil
}
