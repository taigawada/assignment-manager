#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]] ; then
  # Proceed with the production build
  echo "✅ - Deploy to the production environment"
  exit 1;
elif [[ "$VERCEL_GIT_COMMIT_REF" == "develop" ]] ; then
  # Proceed with the development build
  echo "✅ - Build can proceed"
  exit 1;
else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi