// Client action: Connect
// Inputs : WsUrl (Text), Token (Text), EnableMicrophone (Boolean)
// Outputs: Success (Boolean), ErrorMessage (Text)
// Paste into the JavaScript node of the Connect client action.

(async () => {
  try {
    if (typeof LivekitClient === "undefined") {
      throw new Error("livekit-client is not loaded. Add the LiveKitRuntime block to your layout or screen.");
    }
    if (!$parameters.WsUrl || !$parameters.Token) {
      throw new Error("WsUrl and Token are required.");
    }

    // Leave any previous session
    if (window.lkRoom) {
      try { window.lkRoom.disconnect(); } catch (e) { /* ignore */ }
      window.lkRoom = null;
    }

    // Hidden container that holds the remote audio elements
    let container = document.getElementById("livekit-audio-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "livekit-audio-container";
      container.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;";
      document.body.appendChild(container);
    }

    const room = new LivekitClient.Room();
    window.lkRoom = room;

    room.on(LivekitClient.RoomEvent.TrackSubscribed, (track) => {
      if (track.kind === "audio") {
        container.appendChild(track.attach());
      }
    });
    room.on(LivekitClient.RoomEvent.TrackUnsubscribed, (track) => {
      track.detach().forEach((el) => el.remove());
    });

    await room.connect($parameters.WsUrl, $parameters.Token);

    try { await room.startAudio(); } catch (e) { console.warn("startAudio:", e); }

    if ($parameters.EnableMicrophone) {
      await room.localParticipant.setMicrophoneEnabled(true);
    }

    $parameters.Success = true;
    $parameters.ErrorMessage = "";
  } catch (err) {
    $parameters.Success = false;
    $parameters.ErrorMessage = (err && err.message) ? err.message : String(err);
  }
  $resolve();
})();
