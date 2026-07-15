# iter (mobile)

The mobile app for iter, a running app. Built with Expo/React Native from our Figma designs.

Track runs with GPS, build and save routes on a map, and check your run history.

## Backend

This app talks to the same backend as the web app (`iter-main`). Signing up, logging in, and saved routes all go through the real API. Run history is just saved on your phone for now.

## Getting started

1. `npm install`
2. Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` to the backend URL (ask in the group chat if you don't have it)
3. `npx expo start`, then scan the QR code with Expo Go on your phone

## Notes

- Allow location access when it asks, or the map defaults to Central Park instead of your actual location
- Run history is only saved on your phone right now, not synced anywhere, so it won't carry over if you reinstall
