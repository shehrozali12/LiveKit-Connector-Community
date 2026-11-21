# LiveKit Connector (Community) for OutSystems Developer Cloud (ODC)

An unofficial, community-built connector that lets ODC apps use
[LiveKit](https://livekit.io) for real-time voice, video and AI voice agents.

> This project is not affiliated with or endorsed by LiveKit or OutSystems.

## What is in this repository

| Folder | Content | Status |
|---|---|---|
| `external-logic/` | C# external library that creates LiveKit access tokens | v1.0.0 released |
| `odc/` | ODC library: client actions, `LiveKitRuntime` block, token server action | v1.0.1 released |
| `demo/` | Demo app (voice agent screen) | Planned |
| `docs/` | Setup guide and troubleshooting | Planned |

## How it works

1. The ODC server action creates a short-lived access token (signed with your
   LiveKit API secret). The secret never reaches the browser.
2. The browser uses the token to join a LiveKit room.
3. Optionally, a named LiveKit agent is dispatched to the room.

## Security notes

- Keep the API key and secret in secret app settings, never in client code.
- Take the user identity from the logged-in user on the server.
- Keep the token lifetime short.

## License

MIT, see `LICENSE`.
