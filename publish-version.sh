#!/usr/bin/env bash

COMMIT_ID=$(git rev-parse --short HEAD) node publish-version.js
