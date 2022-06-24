FROM nginx:1.22.0 AS base

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf


FROM base AS dev


FROM base AS prod

COPY ./src/ /etc/nginx/html/
