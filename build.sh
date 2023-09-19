#!/usr/bin/env bash

cd_lambda() {
				SCRIPT_BASE="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
				pushd "$SCRIPT_BASE/lambda"
}

build_webpack() {
				cd_lambda
				npm run build
				popd
}

build_files() {
				cd_lambda
				if [[ -d dist ]]; then
								rm -rf dist
				fi

				mkdir dist
				cp -r node_modules dist
				cp -r src dist
				popd
}

build_files
