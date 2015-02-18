echo "copy lanchconfiguration"
date '+%A %W %Y %X'
cp -a /config/launchConfigurations /src
cat /src/launchConfigurations/node.launch
node /orion/org.eclipse.orion.client/modules/orionode/server.js --config /orion/orion.conf --port 8081
echo "end copy process"
