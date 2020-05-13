#!/bin/bash

helpFunction() {
   echo ""
   echo "Usage: $0 -p port"
   echo -e "\t-p Defines the port to use for the temporary web server"
   exit 1 # Exit script after printing help
}

#while getopts "a:b:c:" opt
while getopts "p:" opt
do
   case "$opt" in
      p ) port="$OPTARG" ;;
      ? ) helpFunction ;; # Print helpFunction in case parameter is non-existent
   esac
done

# Print helpFunction in case parameters are empty
if [ -z "$port" ]
then
   echo "Some or all of the parameters are empty";
   helpFunction
fi

#echo "$port"
open -a /Applications/Google\ Chrome.app http://localhost:$port/ & python3 -m http.server $port