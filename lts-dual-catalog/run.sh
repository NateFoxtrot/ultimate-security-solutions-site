#!/bin/bash
cd /home/nate_foxtrot/lts-dual-catalog
node index.js || read -p '❌ Crashed. Press Enter to exit...'
echo ''
read -p '✅ Finished. Press Enter to close...'
