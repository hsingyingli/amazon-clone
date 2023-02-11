FROM golang:1.18-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o main main.go 

FROM alpine:3.13 
WORKDIR /app 
COPY ./config ./config
COPY --from=builder /app/main ./

EXPOSE 9010
CMD ["./main"]
