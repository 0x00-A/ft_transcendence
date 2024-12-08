#!/bin/bash

# Ensure correct file permissions
chown elasticsearch:elasticsearch /usr/share/elasticsearch/config/certs/*
chmod 640 /usr/share/elasticsearch/config/certs/*

# Run Elasticsearch
exec "$@"
