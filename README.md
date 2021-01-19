# event-pusher
Event pusher is a nodejs-express project that receives logs of events from a mobile application, and sends it to the Google Cloud using Pub/Sub, DataFlow and BigQuery.

## Prerequisites
- docker
- docker-compose

## Build and Run
```bash
export GOOGLE_APPLICATION_CREDENTIALS="[path-to-credentials]"
docker-compose up --build
```

Navigate to this using browser:
[http://localhost:3000/](http://localhost:3000)


## Versions

```bash
$ docker -v
Docker version 19.03.6, build 369ce74a3c
```
```bash
$ docker-compose version
docker-compose version 1.26.2, build unknown
docker-py version: 4.2.2
CPython version: 3.6.11
OpenSSL version: OpenSSL 1.1.1f  31 Mar 2020
```

