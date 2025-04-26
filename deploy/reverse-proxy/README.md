# Reverse proxy 

When the certificate has expired or a new service is added to the reverse proxy,
make sure to comment out the services in the nginx.conf to leave only the 
server block for port 80 enabled. This is necessary for certbot to work. 

If the services aren't commented out, the reverse proxy container will 
fail, since nginx cannot find the certificate which is required in the 
443 server blocks.

This will lead to the certbot container failing, which needs the reverse proxy 
to run in order to check the challenge files.

