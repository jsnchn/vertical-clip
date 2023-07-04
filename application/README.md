###dependencies:
- go1.16.3 darwin/amd64
- docker

###setup:
- build image with `docker build -t loadbalanced-go-api .`
- run `docker images` to check that `loadbalanced-go-api` image was created
- run `docker run --name verticlip-api --rm -p 5000:5000 loadbalanced-go-api` to create and run container
- run `docker ps` to check status of container
- api accessible at `localhost` or `localhost:80`
- run `docker kill [container name]` to stop container
####OR
- run `make start` or `make start-logs` to build image and start container with docker compose
- api accessible at `localhost` or `localhost:80`
- run `make stop` to kill container
####OR ( non docker option for local dev )
- run `go run main.go`
- api accessible at `localhost:5000`