#!/bin/bash


# Variables
REPO_URL="git@github.com:0x00-A/ft_transcendence.git"
REPO_NAME="ft_transcendence"
TARGET_DIR="/goinfre/$USER/$REPO_NAME"
docker_destination="/goinfre/$USER/docker"

# rm -rf docker_destination | true
bash ~/bleach_42/init_docker.bash

git clone "$REPO_URL" "$TARGET_DIR"

cd "$TARGET_DIR" || exit

cd frontend || exit
npm install

cd ..

python3 -m venv .venv

source .venv/bin/activate

grep -v "psycopg2" backend/requirements.txt > backend/requirements_no_psycopg2.txt
pip install -r backend/requirements_no_psycopg2.txt

rm backend/requirements_no_psycopg2.txt

make fclean

make makemigrations

make

echo "Setup complete in /goinfre/$USER/$REPO_NAME!"
