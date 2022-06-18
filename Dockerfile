FROM nginx:1.22.0 AS base

FROM base AS dev

FROM base AS prod

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./src/ /etc/nginx/html/
