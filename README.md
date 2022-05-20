## Start Mongo locally
```
docker volume create crawdl
docker run --name crawdl-mongo -v crawdl:/data/db -p 27017:27017 -d mongo
```
