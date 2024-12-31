#!/bin/bash

# This script will delete all the material assets in the ./assets directory
# and recreate the directory structure. 
# It will also delete the schema in the postgres database and recreate it.

# Check if the ./assets directory exists
if [[ $(pwd) == *"teachme/be"* ]]; then
  echo -e "You are in the correct directory (teachme/be). \n"
else
  echo -e "You are not in the correct directory. \n"
  exit 1
fi

if [[ -z $1 || $1 != "execute" ]]; then
  echo -e "Please provide the argument 'execute' to run the script. \n"
  exit 1
else
  echo -e "The script will now run. \n"
fi

if [ -d "./assets" ]; then
    echo -e "Delete all the material assets in the ./assets directory \n"
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
