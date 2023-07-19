FROM httpd:2.4

RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_19.x | bash - && \
    apt-get install -y nodejs

WORKDIR /tmp

COPY package*.json ./
COPY client/package*.json ./client/

RUN npm install

COPY client/ ./client/

RUN npm run build -w client

WORKDIR /

COPY ./client/dist/ /usr/local/apache2/htdocs/

RUN apt-get purge -y --auto-remove nodejs
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /tmp


EXPOSE 80