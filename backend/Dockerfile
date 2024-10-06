# FROM python:3.9-alpine3.13
FROM python:3.12.7-alpine3.20

LABEL maintainer='abdelatif'

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

COPY ./requirements.txt /tmp/requirements.txt
COPY ./requirements.dev.txt /tmp/requirements.dev.txt
COPY . /app/backend
WORKDIR /app/backend
EXPOSE 8000

ARG DEV=false

RUN pip install --upgrade pip && \
    apk add --update --no-cache postgresql-client && \
    apk add --update --no-cache --virtual .tmp-build-deps \
    build-base postgresql-dev musl-dev && \
    pip install -r /tmp/requirements.txt && \
    if [ $DEV = "true" ]; \
    then pip install -r /tmp/requirements.dev.txt ; \
    fi && \
    rm -rf /tmp && \
    apk del .tmp-build-deps && \
    adduser \
    --disabled-password \
    --no-create-home \
    django-user

# ENV PATH='/py/bin:/sbin:/bin:/usr/sbin:/usr/bin:$PATH'

USER django-user

# ENTRYPOINT [ "python" ]

# CMD [ "manage.py", "runserver", "0.0.0.0:8000" ]
