#!/usr/bin/env bash

if which >/dev/null 2>&1 php ; then
	php -S 127.0.0.1:9229 -t "$(dirname "$0")"/src
fi
