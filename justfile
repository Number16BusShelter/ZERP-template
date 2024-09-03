default:
    @just --choose

boot:
    bash ./scripts/bash/bootstrap.sh

help:
    pnpm help

docker-local-start:
    docker compose -f ./cicd/.docker/compose/docker-compose.yml up -d

docker-local-stop:
    docker compose -f ./cicd/.docker/compose/docker-compose.yml down
