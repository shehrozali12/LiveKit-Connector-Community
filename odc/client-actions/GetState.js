// Client action: GetState
// Outputs: State (Text), AgentPresent (Boolean), RemoteParticipantCount (Integer)
// Paste into the JavaScript node of the GetState client action.

const lkRoomNow = window.lkRoom;
if (!lkRoomNow) {
  $parameters.State = "disconnected";
  $parameters.AgentPresent = false;
  $parameters.RemoteParticipantCount = 0;
} else {
  let agentFound = false;
  for (const p of lkRoomNow.remoteParticipants.values()) {
    if (p.kind === LivekitClient.ParticipantKind.AGENT) agentFound = true;
  }
  $parameters.State = lkRoomNow.state;
  $parameters.AgentPresent = agentFound;
  $parameters.RemoteParticipantCount = lkRoomNow.remoteParticipants.size;
}
