docker-compose --env-file server/.env -f docker-compose.server.prod.yml up -d && \
docker-compose --env-file client/.env -f docker-compose.client.prod.yml up -d