# ODC library: LiveKitConnector_Client

Reusable client actions, one server action and one block that let ODC apps
join LiveKit rooms (voice, and AI voice agents).

## Public API

### Block
| Name | Purpose |
|---|---|
| `LiveKitRuntime` | Invisible block. Place it once in a layout or screen. It loads `livekit-client.umd.js`. |

### Client actions
| Name | Inputs | Outputs |
|---|---|---|
| `Connect` | `WsUrl` (Text), `Token` (Text), `EnableMicrophone` (Boolean) | `Success` (Boolean), `ErrorMessage` (Text) |
| `Disconnect` | - | - |
| `SetMicrophone` | `Enabled` (Boolean) | `Success` (Boolean), `ErrorMessage` (Text) |
| `WaitForAgent` | `TimeoutSeconds` (Integer) | `AgentJoined` (Boolean), `AgentIdentity` (Text) |
| `GetState` | - | `State` (Text), `AgentPresent` (Boolean), `RemoteParticipantCount` (Integer) |

### Server action
| Name | Inputs | Output |
|---|---|---|
| `CreateAccessToken` | `ApiKey`, `ApiSecret`, `Room`, `Identity`, `AgentName` (all Text) | `Token` (Text) |

`CreateAccessToken` calls `LiveKitConnector.GenerateToken` (external library) with
safe defaults: 1 hour lifetime, publish and subscribe allowed, data publishing off.

## Usage in an app

1. Add `LiveKitConnector_Client` as a dependency.
2. Place the `LiveKitRuntime` block in the layout or screen.
3. Server action: call `CreateAccessToken` with keys taken from secret app settings.
   Take `Identity` from the logged-in user, not from client input.
4. Client action: call `Connect` with the URL and the token.
5. Optionally call `WaitForAgent`, then `Disconnect` when finished.

## Files

- `client-actions/*.js`: code for the JavaScript node of each client action.
- `resources/livekit-client.umd.js`: bundled livekit-client (Apache-2.0).
