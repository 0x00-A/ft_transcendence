FROM nginxinc/nginx-unprivileged:1-alpine
# FROM nginx:alpine
LABEL maintainer="aigounad"

ENV LISTEN_PORT=8080
ENV APP_HOST=backend
ENV APP_PORT=8000

# COPY ./default.conf.tpl /etc/nginx/default.conf.tpl


COPY ./default.conf /etc/nginx/conf.d/default.conf

USER root

# RUN mkdir -p /vol/static && \
#     chmod 755 /vol/static && \
#     touch /etc/nginx/conf.d/default.conf && \
#     chown nginx:nginx /etc/nginx/conf.d/default.conf

RUN apk add --update --no-cache certbot certbot-nginx

COPY ./entrypoint.sh /docker-entrypoint.d/entrypoint.sh
RUN chmod +x /docker-entrypoint.d/entrypoint.sh
RUN rm -rf /usr/share/nginx/html/*

# VOLUME /vol/static

EXPOSE 80 443

# USER nginx

# CMD [ "/entrypoint.sh" ]
