FROM nginxinc/nginx-unprivileged:1-alpine
# FROM nginx:alpine
# LABEL maintainer="aigounad"

# ENV LISTEN_PORT=8080
# ENV APP_HOST=backend
# ENV APP_PORT=8000

# COPY ./config/default.conf.tpl /etc/nginx/default.conf.tpl


COPY ./config/default.conf /etc/nginx/conf.d/default.conf
# WORKDIR /etc/nginx
# COPY ./config/nginx.conf .


USER root

RUN rm /var/log/nginx/access.log /var/log/nginx/error.log && \
    touch /var/log/nginx/access.log && touch /var/log/nginx/error.log && \
    chown nginx:nginx /var/log/nginx/access.log && \
    chown nginx:nginx /var/log/nginx/error.log

# RUN mkdir -p /vol/static && \
#     chmod 755 /vol/static && \
#     touch /etc/nginx/conf.d/default.conf && \
#     chown nginx:nginx /etc/nginx/conf.d/default.conf

# RUN apk add --update --no-cache certbot certbot-nginx

COPY ./scripts/entrypoint.sh /docker-entrypoint.d/entrypoint.sh
RUN chmod +x /docker-entrypoint.d/entrypoint.sh
RUN rm -rf /usr/share/nginx/html/*

# VOLUME /vol/static

EXPOSE 80 443

USER nginx

# CMD [ "/entrypoint.sh" ]
