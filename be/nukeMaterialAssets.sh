#!/bin/bash

# This script will delete all the material assets in the ./assets directory

# Check if the ./assets directory exists
if [ -d "./assets" ]; then
    # Delete all the material assets in the ./assets directory
    rm -rfv ./assets/*
    echo -e "All material assets have been deleted. \n"
    mkdir -v ./assets/avatars
    mkdir -v ./assets/materials
    mkdir -v ./assets/images
    mkdir -v ./assets/previews
    echo -e "The ./assets directory structure has been recreated. \n"

else
    echo -e "The ./assets directory does not exist. \n"
fi

echo -e "Deleting schema and recreating it in postgres database... \n"

psql -h 172.17.0.1 -p 5432 -U postgres passfile=".pgpass" -c "DROP SCHEMA public CASCADE;"
psql -h 172.17.0.1 -p 5432 -U postgres passfile=".pgpass" -c "CREATE SCHEMA public;"
