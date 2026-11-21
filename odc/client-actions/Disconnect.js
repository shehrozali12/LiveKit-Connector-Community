// Client action: Disconnect
// No inputs or outputs.
// Paste into the JavaScript node of the Disconnect client action.

if (window.lkRoom) {
  try { window.lkRoom.disconnect(); } catch (e) { /* ignore */ }
  window.lkRoom = null;
}
const lkContainer = document.getElementById("livekit-audio-container");
if (lkContainer) {
  lkContainer.innerHTML = "";
}
