FROM golang:1.14-alpine AS build

RUN apk update && apk upgrade && \
    apk add --no-cache git

WORKDIR /tmp/app

COPY go.mod .
# COPY go.sum .
RUN go mod download

COPY . .

# Build binary file called "api" at /tmp/app/out/api
RUN GOOS=linux go build -o ./out/api .

#########################################################

# After successful build use alpine image to run the server
FROM alpine:latest

# Add CA Certificates
RUN apk add ca-certificates

# Add ffmpeg
RUN apk add ffmpeg

# Copy binary file from the BUILD container to /app
COPY --from=build /tmp/app/out/api /app/api

WORKDIR "/app"

EXPOSE 5000

# Run binary
CMD ["./api"]