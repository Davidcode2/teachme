#!/bin/bash

# Generate the keystore using the environment variable
keytool -genkeypair -storepass "$KEYSTORE_PASSWORD" -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -keystore conf/server.keystore

# Start Keycloak with the keystore and password
/opt/keycloak/bin/kc.sh start \
    --https-server-keystore-file=/opt/keycloak/conf/server.keystore \
    --https-server-keystore-password="$KEYSTORE_PASSWORD" \
    --https-server-cert-file=/opt/keycloak/conf/fullchain.pem \
    --https-server-key-file=/opt/keycloak/conf/privkey.pem
