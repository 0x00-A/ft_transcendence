#!/bin/sh
set -e

# # Check if SSL certificates already exist
# if [ ! -f /etc/letsencrypt/live/ft-pong.me/fullchain.pem ]; then
#   # Obtain SSL certificates from Let's Encrypt
#   echo "Creating SSL CERT..."
#   certbot --nginx -d ft-pong.me -d www.ft-pong.me --non-interactive --agree-tos --email abdellatifigounad@gmail.com
# fi

# # Set up automatic certificate renewal
# echo "0 0 * * * certbot renew --quiet && nginx -s reload" | crontab -

# envsubst < /etc/nginx/default.conf.tpl > /etc/nginx/conf.d/default.conf

# exec nginx -g 'daemon off;'
