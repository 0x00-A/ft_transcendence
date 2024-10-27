#!/bin/bash

# Set variables for configuration file paths
PGDATA_DIR="/var/lib/postgresql/data"
CONF_FILE="$PGDATA_DIR/postgresql.conf"
HBA_FILE="$PGDATA_DIR/pg_hba.conf"

# Function to update the postgresql.conf file
configure_postgres() {
  echo "Configuring PostgreSQL to listen on all network interfaces..."
  if grep -q "^#listen_addresses" "$CONF_FILE"; then
    sed -i "s/^#listen_addresses.*/listen_addresses = '*'/g" "$CONF_FILE"
  elif grep -q "^listen_addresses" "$CONF_FILE"; then
    sed -i "s/^listen_addresses.*/listen_addresses = '*'/g" "$CONF_FILE"
  else
    echo "listen_addresses = '*'" >> "$CONF_FILE"
  fi
}

# Function to update the pg_hba.conf file
configure_pg_hba() {
  echo "Configuring PostgreSQL host-based authentication..."
  echo "host all all 0.0.0.0/0 md5" >> "$HBA_FILE"
}

# Run PostgreSQL initialization if PGDATA is empty
if [ ! -s "$PGDATA_DIR/PG_VERSION" ]; then
  echo "Initializing PostgreSQL database..."
  docker-entrypoint.sh postgres
  configure_postgres
  configure_pg_hba
fi

# Start PostgreSQL
echo "Starting PostgreSQL..."
exec docker-entrypoint.sh postgres
