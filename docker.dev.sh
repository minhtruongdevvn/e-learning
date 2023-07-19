#!/bin/bash
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Error: workspace and operation arguments are required"
    exit 1
fi

workspace=$1
operation=$2
service=$3

if [ "$workspace" == "server" ]; then
    if [ -z "$service" ]; then
        docker-compose -f docker-compose.server.yml --env-file server/.env $operation -d
    else
        docker-compose -f docker-compose.server.yml --env-file server/.env $operation -d --no-deps $service
    fi
elif [ "$workspace" == "client" ]; then
    echo "not implemented"
else
    echo "workspace not found"
fi
