using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using OutSystems.ExternalLibraries.SDK;

namespace LiveKitConnector
{
    [OSInterface(
        Name = "LiveKitConnector",
        Description = "Community connector for LiveKit. Creates signed access tokens so users can join LiveKit rooms, and can request a named AI agent for the room.",
        IconResourceName = "LiveKitConnector.resources.icon.png")]
    public interface ILiveKitConnector
    {
        [OSAction(
            Description = "Creates a signed LiveKit access token (JWT, HS256). Pass empty text for optional values.",
            ReturnName = "Token",
            ReturnDescription = "The signed access token to give to the LiveKit client.")]
        string GenerateToken(
            [OSParameter(Description = "LiveKit API key. Required.")] string apiKey,
            [OSParameter(Description = "LiveKit API secret. Required. Keep it in a secret app setting.")] string apiSecret,
            [OSParameter(Description = "Room the token is valid for. Required.")] string room,
            [OSParameter(Description = "Unique identity of the participant. Required. Use the logged-in user, not client input.")] string identity,
            [OSParameter(Description = "Display name of the participant. Optional.")] string displayName,
            [OSParameter(Description = "Participant metadata (text or JSON). Optional.")] string metadata,
            [OSParameter(Description = "Token lifetime in seconds. Default 3600 when 0 or less. Maximum 86400.")] int ttlSeconds,
            [OSParameter(Description = "Allow the participant to publish audio and video.")] bool canPublish,
            [OSParameter(Description = "Allow the participant to receive audio and video.")] bool canSubscribe,
            [OSParameter(Description = "Allow the participant to send data messages.")] bool canPublishData,
            [OSParameter(Description = "Name of a LiveKit agent to dispatch when the room is created. Optional.")] string agentName,
            [OSParameter(Description = "Metadata passed to the dispatched agent. Optional.")] string agentMetadata);
    }

    public class LiveKitConnectorService : ILiveKitConnector
    {
        private const int DefaultTtlSeconds = 3600;
        private const int MaxTtlSeconds = 86400;

        public string GenerateToken(
            string apiKey,
            string apiSecret,
            string room,
            string identity,
            string displayName,
            string metadata,
            int ttlSeconds,
            bool canPublish,
            bool canSubscribe,
            bool canPublishData,
            string agentName,
            string agentMetadata)
        {
            Require(apiKey, "apiKey");
            Require(apiSecret, "apiSecret");
            Require(room, "room");
            Require(identity, "identity");

            if (ttlSeconds <= 0) ttlSeconds = DefaultTtlSeconds;
            if (ttlSeconds > MaxTtlSeconds) ttlSeconds = MaxTtlSeconds;

            long now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

            var video = new Dictionary<string, object>
            {
                ["room"] = room,
                ["roomJoin"] = true,
                ["canPublish"] = canPublish,
                ["canSubscribe"] = canSubscribe,
                ["canPublishData"] = canPublishData
            };

            var claims = new Dictionary<string, object>
            {
                ["iss"] = apiKey,
                ["sub"] = identity,
                ["nbf"] = now - 10,   // small tolerance for clock differences
                ["exp"] = now + ttlSeconds,
                ["video"] = video
            };

            if (!string.IsNullOrWhiteSpace(displayName)) claims["name"] = displayName;
            if (!string.IsNullOrWhiteSpace(metadata)) claims["metadata"] = metadata;

            if (!string.IsNullOrWhiteSpace(agentName))
            {
                var agent = new Dictionary<string, object> { ["agentName"] = agentName.Trim() };
                if (!string.IsNullOrWhiteSpace(agentMetadata)) agent["metadata"] = agentMetadata;
                claims["roomConfig"] = new Dictionary<string, object>
                {
                    ["agents"] = new[] { agent }
                };
            }

            string header = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
            string payload = JsonSerializer.Serialize(claims);

            string unsigned = B64Url(Encoding.UTF8.GetBytes(header)) + "." +
                              B64Url(Encoding.UTF8.GetBytes(payload));

            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(apiSecret));
            byte[] signature = hmac.ComputeHash(Encoding.UTF8.GetBytes(unsigned));
            return unsigned + "." + B64Url(signature);
        }

        private static void Require(string value, string name)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("LiveKit Connector: '" + name + "' is required.");
        }

        private static string B64Url(byte[] data) =>
            Convert.ToBase64String(data).TrimEnd('=').Replace('+', '-').Replace('/', '_');
    }
}
