#!/bin/bash

echo "Starting E2E Test Suite..."

export FLASK_ENV=testing
pytest -v -s

echo "Test run complete."