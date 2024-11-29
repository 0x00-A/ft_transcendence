FROM nginxinc/nginx-unprivileged:1-alpine
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

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# VOLUME /vol/static

USER nginx

# CMD [ "/entrypoint.sh" ]
