#!/bin/bash

# Start Keycloak with the http-enabled
/opt/keycloak/bin/kc.sh start \
  --http-enabled=true \
  --proxy-headers=xforwarded \
  --log=console \
  --log-console-output=json \

