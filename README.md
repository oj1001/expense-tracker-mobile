# Morrow mobile

Morrow is a React Native app for tracking everyday spending on Android and iOS. It is built with Expo and TypeScript.

## Run the app

```powershell
npm install
npm start
```

Press `a` to open an Android emulator or scan the QR code with Expo Go. iOS simulator builds require macOS; an iPhone can run the app with Expo Go over the local network.

## Connect the API

The app uses `http://localhost:8080/api` on iOS and web, and `http://10.0.2.2:8080/api` on an Android emulator. For a physical phone, update `API_BASE_URL` in `src/api/client.ts` to use your development computer's LAN IP address.

The app starts with sample entries if the API is unavailable. The connection notice explains when data is sample or only saved for the current session; start the API before entering expenses you want persisted.

## Validate

```powershell
npm run typecheck
```
