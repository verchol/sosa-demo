echo "copy lanchconfiguration"
date '+%A %W %Y %X'
cp -a /config/launchConfigurations /workspace
cat /workspace/launchConfigurations/node.launch
node /orion/org.eclipse.orion.client/modules/orionode/server.js -workspace /workspace --config /orion/orion.conf --port 8081
echo "end copy process"
