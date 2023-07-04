package main

import (
	"io"
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"regexp"
)

func UploadFileToTemp(r *http.Request, tmpDir string) (*os.File, error) {
	// Maximum upload of 40 MB files
	r.ParseMultipartForm(40 << 20)

	// Get handler for filename, size and headers
	file, handler, err := r.FormFile("sourceVideo")
	if err != nil {
		log.Println("Error Retrieving the File")
		log.Println(err)
		return nil, err
	}
	defer file.Close()

	tmpFile, err := tmpFileGen(file, tmpDir, handler.Filename)

	log.Println("Uploaded:",tmpFile.Name())

	return tmpFile, nil
}

func DownloadFileToTemp(url string, tmpDir string) (*os.File, error){
	// Get the data
	resp, err := http.Get(url)
	if err != nil {
		return nil,err
	}
	defer resp.Body.Close()

	tmpFile, err := tmpFileGen(resp.Body, tmpDir, path.Base(url))

	log.Printf(`Downloaded %s from %s`,tmpFile.Name(),url)

	return tmpFile, nil
}

func tmpFileGen(file io.Reader, tmpDir string, name string) (*os.File, error) {

	// Convert file name to file-safe, url-safe string
	var re = regexp.MustCompile(`[^A-Za-z0-9_.-]+`)
	safeName := re.ReplaceAllString(name, "_")

	// Create file
	tmpFilePath := filepath.Join(tmpDir,safeName)
	tmpFile, err := os.Create(tmpFilePath)
	defer tmpFile.Close()
	if err != nil {
		log.Println("Error creating temp file")
		return nil, err
	}

	// Copy the uploaded file to the created file on the filesystem
	if _, err := io.Copy(tmpFile, file); err != nil {
		log.Println("Error saving temp file")
		return nil, err
	}

	return tmpFile, nil
}


func RemoveTempDir(tmpDir string) error {
	err := os.RemoveAll(tmpDir)
	if err != nil {
		log.Println("Error Removing "+tmpDir)
		return err
	}
	log.Println("Removed "+tmpDir)
	return nil
}
