#!/bin/bash

DIR="$( cd "$( dirname "$0" )" && pwd )"

rm -r $DIR/client/src/shared/extension
cp -r $DIR/browser_extension/src/main/shared $DIR/client/src/shared/extension

cd client
yarn lint
