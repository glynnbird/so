#!/bin/bash

# create package
bx wsk package update so --param ACCOUNT "$ACCOUNT" --param PASSWORD "$PASSWORD" --param DBNAME "$DBNAME" --param TAG "$TAG" --param HOOK "$HOOK"

# deploy polling action
cp poll.js index.js
zip -r poll.zip index.js node_modules
bx wsk action update so/poll --kind nodejs:8 poll.zip
rm poll.zip
rm index.js

# deploy notifier
cp notify.js index.js
zip -r notify.zip index.js node_modules
bx wsk action update so/notify --kind nodejs:8 notify.zip
rm notify.zip
rm index.js

# trigger this action every 30 minutes
#bx wsk trigger update soCloudantTrigger --feed /whisk.system/alarms/interval --param minutes 30
#bx wsk rule update soCloudantRule soCloudantTrigger so/poll