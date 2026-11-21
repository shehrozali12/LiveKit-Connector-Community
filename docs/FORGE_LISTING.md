# Forge listing texts

Texts to paste into the "Submit to Forge" wizard. Adjust the wording to your own style.

Submit in this order, because each asset needs the one before it:

1. LiveKitConnector (external library)
2. LiveKitConnector_Client (library)
3. LiveKitConnector_Demo (app)

---

## 1. LiveKitConnector (external library)

**Short description**
Creates signed LiveKit access tokens in ODC, with permissions and optional AI agent dispatch.

**Detailed description**
LiveKit is an open-source platform for real-time voice, video and AI voice agents. This external library lets your ODC server create the access token that a user needs to join a LiveKit room.

- Signs tokens on the server, so your API secret never reaches the browser.
- Sets the token lifetime (default 1 hour, maximum 24 hours).
- Sets what the user may do: publish audio and video, subscribe, send data.
- Optionally asks LiveKit to send a named AI agent into the room.
- Has no extra NuGet dependencies.

Most developers use this asset through the LiveKitConnector_Client library.

**Limitations**
- Creates tokens only. It does not call the LiveKit server API (rooms, recordings).
- Token-based agent dispatch works only when the room is created. If the room already exists, the agent is not dispatched again.

**Release notes 1.0.0**
First release. Action GenerateToken with permissions, display name, metadata and agent dispatch.

---

## 2. LiveKitConnector_Client (library)

**Short description**
Join LiveKit rooms from ODC apps. Client actions for voice and AI agents, plus a token server action.

**Detailed description**
This library gives your Reactive web app everything it needs to join a LiveKit room and talk to an AI voice agent, without writing JavaScript.

- Block LiveKitRuntime: place it once; it loads the LiveKit client script.
- Client actions: Connect, Disconnect, SetMicrophone, WaitForAgent, GetState.
- Server action CreateAccessToken: creates a short-lived token with safe defaults.
- Remote audio plays automatically. No audio container is needed on your screens.

**Limitations**
- Reactive web apps. Mobile apps are not tested.
- Voice only in version 1.0.0. No video display.
- The page must run over HTTPS, and the user must allow the microphone.
- One room connection per browser tab.
- You need your own LiveKit account (a free plan exists) and, for agents, a deployed LiveKit agent.

**Release notes 1.0.1**
Added the icon and the description. No change in behavior.

**Release notes 1.0.0**
First release. Block LiveKitRuntime, five client actions, server action CreateAccessToken.

---

## 3. LiveKitConnector_Demo (app)

**Short description**
Demo app: talk to a LiveKit AI voice agent from an ODC screen.

**Detailed description**
A small working example of LiveKitConnector_Client. A signed-in user enters a room name, joins, and talks to an AI voice agent. The screen shows the status (connected, waiting for the agent, agent present) and has buttons to mute and leave.

**Limitations**
- Needs the four app settings listed in the documentation.
- Uses one room per user. It is an example, not a production design.

**Release notes 1.0.0**
First release.

---

## Documentation (paste into the documentation step of the wizard)

### Introduction

LiveKit Connector (Community) lets your ODC app join LiveKit rooms for real-time voice and AI voice agents. It is an unofficial, community-built component and is not affiliated with LiveKit or OutSystems.

Use it when you want users to speak with an AI agent from an ODC screen. The user clicks Join, the server creates a short-lived access token, the browser joins the LiveKit room, and the agent answers.

The component has three assets:

- LiveKitConnector: external library that creates the access token.
- LiveKitConnector_Client: library with the block, five client actions and the token server action.
- LiveKitConnector_Demo: example app.

Source code and issues: https://github.com/shehrozali12/LiveKit-Connector-Community

### Prerequisites

- A LiveKit Cloud project (a free plan is enough for testing).
- A deployed LiveKit AI agent, if you want to talk to an agent.
- A Reactive web app in ODC Studio.

### Set up LiveKit

1. Open your project in the LiveKit Cloud dashboard.
2. Copy the project URL. It starts with wss://.
3. Open Settings, then Keys, and create an API key.
4. Copy the API key and the API secret. The secret is shown only once.
5. If you use an agent, open your agent and copy its name.

### Install

1. In ODC Portal, open Forge.
2. Find LiveKit Connector (Community).
3. Click Install on LiveKitConnector_Client. Confirm the installation of LiveKitConnector if Forge asks.
4. In ODC Studio, open your app and select Manage Dependencies.
5. Add the block LiveKitRuntime, the five client actions and the server action CreateAccessToken.

### Configure your app

1. Create the app settings LiveKitUrl, LiveKitApiKey, LiveKitApiSecret and LiveKitAgentName (all Text).
2. Mark LiveKitApiSecret as secret.
3. Publish the app once.
4. In ODC Portal, enter the values for each stage.
5. Place the LiveKitRuntime block once on your screen or layout.

### Use it

1. Create a server action GetToken with the input Room and the outputs Token and WsUrl.
2. Call CreateAccessToken with your settings. For Identity, use the user id from the server, for example GetUserId().
3. In a client action, call GetToken, then call Connect with WsUrl and Token.
4. Check Connect.Success. If it is False, show Connect.ErrorMessage.
5. Call WaitForAgent to wait until the agent joins.
6. Call SetMicrophone to mute or unmute, and Disconnect to leave.

### Security

- Keep the API secret in a secret app setting. Never put it in client code.
- Take the user identity from the server, not from user input.
- Restrict who can call your token action. Anyone who can call it can use your LiveKit account.
- Keep the token lifetime short.

### Troubleshooting

| Problem | Cause and fix |
|---|---|
| Error "invalid token" or 401 | The API key or secret is wrong, empty or belongs to another project. Check the app settings for the stage you run. |
| Error "livekit-client is not loaded" | The LiveKitRuntime block is not on the screen. Add it. |
| Connected, but no agent joins | The agent name does not match, or the room already existed. Use a new room name. |
| No sound | The browser blocked audio or the microphone. Click the page once and allow the microphone. |
