#!/bin/sh
# Cloudflare Pages build for the React rebuild: builds app/ and serves its
# output from dist/, so the Pages project settings stay as they are (build
# command `npm run build`, output `dist`, Functions from functions/).
# Search indexing is on for the production branch only; every preview
# deploy is a noindex preview.
set -e
if [ "$CF_PAGES_BRANCH" = "main" ]; then
  export ALLOW_INDEXING=1
else
  export ALLOW_INDEXING=0
fi
npm --prefix app ci
npm --prefix app run build
rm -rf dist
cp -R app/dist dist
rm -rf dist/.vite
