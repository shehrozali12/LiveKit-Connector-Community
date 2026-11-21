// Client action: WaitForAgent
// Inputs : TimeoutSeconds (Integer)
// Outputs: AgentJoined (Boolean), AgentIdentity (Text)
// Paste into the JavaScript node of the WaitForAgent client action.

(() => {
  const room = window.lkRoom;
  const timeoutMs = ($parameters.TimeoutSeconds > 0 ? $parameters.TimeoutSeconds : 30) * 1000;

  $parameters.AgentJoined = false;
  $parameters.AgentIdentity = "";

  if (!room) {
    $resolve();
    return;
  }

  const isAgent = (p) => p.kind === LivekitClient.ParticipantKind.AGENT;

  let finished = false;
  let timer = null;

  const finish = (agent) => {
    if (finished) return;
    finished = true;
    if (timer) clearTimeout(timer);
    room.off(LivekitClient.RoomEvent.ParticipantConnected, onJoin);
    if (agent) {
      $parameters.AgentJoined = true;
      $parameters.AgentIdentity = agent.identity || "";
    }
    $resolve();
  };

  const onJoin = (p) => {
    if (isAgent(p)) finish(p);
  };

  // The agent may already be in the room
  for (const p of room.remoteParticipants.values()) {
    if (isAgent(p)) {
      finish(p);
      return;
    }
  }

  room.on(LivekitClient.RoomEvent.ParticipantConnected, onJoin);
  timer = setTimeout(() => finish(null), timeoutMs);
})();
