echo "copy lanchconfiguration"
date '+%A %W %Y %X'
cp -a /config/launchConfigurations /src
cat /src/launchConfigurations/node.launch
node /src
echo "end copy process"
