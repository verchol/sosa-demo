echo "copy lanchconfiguration"
date '+%A %W %Y %X'
cp -rf /config/launchConfigurations /workspace/express-angular
cat /workspace//express-angular/launchConfigurations/node.launch
node /orion/org.eclipse.orion.client/modules/orionode/server.js -workspace /workspace --config /orion/orion.conf --port 8081
echo "end copy process"
