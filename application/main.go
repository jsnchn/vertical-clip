package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/getsentry/sentry-go"
	"github.com/gorilla/mux"
	"gitlab.com/pipeline-gg/verticlip/application/db"
	"gitlab.com/pipeline-gg/verticlip/application/storage"
)

func getProcessedVideo(w http.ResponseWriter, r *http.Request) {
	pathParams := mux.Vars(r)
	videoID := ""
	if val, ok := pathParams["videoID"]; ok {
		if len(val) == 0 {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"message": "Missing Video ID"}`))
			return
		}
		videoID = val
	}

	rdb, err := db.NewDBClient("redis:6379")
	if err != nil {
		log.Printf("Failed to connect to redis: %s", err.Error())
		logAndExit(err)
	}
	data, err := rdb.GetVideoStatus(videoID)
	vs, err := json.Marshal(&data)

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(fmt.Sprintf(string(vs))))
}

func processVideo(w http.ResponseWriter, r *http.Request) {
	pathParams := mux.Vars(r)
	sourceType := ""
	if val, ok := pathParams["sourceType"]; ok {
		if len(val) == 0 {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"message": "Missing source type"}`))
			return
		}
		sourceType = val
	}

	//save source video to temp
	tmpDir, err := ioutil.TempDir(os.TempDir(), "*")
	if err != nil {
		log.Printf("Failed to create temp dir: %s", err.Error())
		panic(err)
	}
	var tmpUpload *os.File
	switch sourceType {
	case "upload":
		tmpUpload, err = UploadFileToTemp(r, tmpDir)
	case "twitch":
		tmpUpload, err = DownloadFileToTemp(r.FormValue("url"), tmpDir)
	default:
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"message": "Unknown source type"}`))
	}
	if err != nil {
		log.Printf("Failed to obtain file: %s", err.Error())
		panic(err)
	}

	//create id and init kv to db
	rdb, err := db.NewDBClient("redis:6379")
	if err != nil {
		log.Printf("Failed to connect to redis: %s", err.Error())
		logAndExit(err)
	}
	id, err := rdb.InitVideoId()

	//respond to client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(fmt.Sprintf(`{"message": "Video is processing.","videoId":"%s"}`, id)))

	//process video
	go func() {
		convertedFileName, err := ConvertVideo(
			tmpUpload.Name(),
			tmpDir,
			r.FormValue("wc_w"),
			r.FormValue("wc_h"),
			r.FormValue("wc_x"),
			r.FormValue("wc_y"),
			r.FormValue("s_w"),
			r.FormValue("s_h"),
			r.FormValue("s_x"),
			r.FormValue("s_y"),
			r.FormValue("s_t"),
			r.FormValue("e_t"),
		)
		log.Println("Converted:", convertedFileName)

		//upload to DO
		spacesClient, err := storage.NewSpacesClient()
		if err != nil {
			log.Printf("Failed to connect to DO Spaces: %s", err.Error())
			logAndExit(err)
		}
		videoUrl, err := spacesClient.Upload(convertedFileName, id)
		if err != nil {
			log.Printf("Failed to upload file to cdn for %s: %s", id, err.Error())
			panic(err)
		}
		log.Printf(`Successful upload to %s`, videoUrl)

		//update status
		vs := db.VideoStatus{Status: 1, Url: videoUrl}
		err = rdb.UpdateVideoStatus(&vs, id)
		if err != nil {
			log.Printf("Failed to update status for %s: %s", id, err.Error())
			panic(err)
		}

		//send link to email

		//cleanup
		defer RemoveTempDir(tmpDir)
	}()
}
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// recover error from panics
		defer func() {
			err := recover()

			if err != nil {
				sentry.CurrentHub().Recover(err)
				sentry.Flush(time.Second * 5)
			}
		}()

		// Call the next handler.
		next.ServeHTTP(w, r)
	})
}

// Helper to capture serious exceptions that should exit the whole program
func logAndExit(err error) {
	sentry.CaptureException(err)
	sentry.Flush(5 * time.Second)
	os.Exit(1)
}
func main() {
	err := sentry.Init(sentry.ClientOptions{
		// Either set your DSN here or set the SENTRY_DSN environment variable.
		Dsn: "https://49ad066e5e0a4f6eabb534ca32c08270@o1029026.ingest.sentry.io/6668161",

		Debug: false,
		// Set TracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		TracesSampleRate: 1.0,
	})
	if err != nil {
		log.Fatalf("sentry.Init: %s", err)
	}
	r := mux.NewRouter()

	api := r.PathPrefix("/api/v1").Subrouter()
	api.HandleFunc("/video/{videoID}", getProcessedVideo).Methods(http.MethodGet, http.MethodOptions)
	api.HandleFunc("/process/{sourceType}", processVideo).Methods(http.MethodPost, http.MethodOptions)
	api.Use(loggingMiddleware)
	log.Fatal(http.ListenAndServe(":5000", api))
}
