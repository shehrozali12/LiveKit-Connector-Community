// Client action: SetMicrophone
// Inputs : Enabled (Boolean)
// Outputs: Success (Boolean), ErrorMessage (Text)
// Paste into the JavaScript node of the SetMicrophone client action.

(async () => {
  try {
    if (!window.lkRoom) {
      throw new Error("Not connected to a LiveKit room.");
    }
    await window.lkRoom.localParticipant.setMicrophoneEnabled($parameters.Enabled);
    $parameters.Success = true;
    $parameters.ErrorMessage = "";
  } catch (err) {
    $parameters.Success = false;
    $parameters.ErrorMessage = (err && err.message) ? err.message : String(err);
  }
  $resolve();
})();
