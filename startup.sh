#!/bin/bash
script="$0"
basename="$(dirname "$script")"
echo "Script name $script resides in $basename directory."

cd "${basename}"

python3 -m http.server 8000
