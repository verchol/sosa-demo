FIX for launch configuraiton.

The dockerCLI assumes that docker container default CMD  is  ["/bin/bash", "/config/start.sh"]
you  can overried it in dockerCli templates

the script start.sh is copied to container's /config/ folder
 
testing deployment to staging over beanstalk via codeship
