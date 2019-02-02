using Newtonsoft.Json;
using System.Collections.Generic;

namespace DixplayServerNETCore.ServerModels
{
    public enum MessageType
    {
        // 100 level is User -> Server messages
        UploadPhoto = 101, // new photo
        UploadComment = 102, // new comment

        // 200 level is Server -> User messages
        GetDixplay = 201, // photo and comments
        GetComments = 202, // updated comments
    }

    public class Message
    {
        public MessageType Type { get; set; }
        public string Payload { get; set; }

        public Message() { }

        public Message(string message)
        {
            Message temp = JsonConvert.DeserializeObject<Message>(message);
            Type = temp.Type;
            Payload = temp.Payload;
        }

        public Message(MessageType type, object data)
        {
            Type = type;
            Payload = JsonConvert.SerializeObject(data);
        }

        public string Serialize()
        {
            return JsonConvert.SerializeObject(this);
        }

        public static string Build(Dixplay dixplay)
        {
            return Write(MessageType.GetDixplay, dixplay);
        }

        public static string Build(LinkedList<string> comments)
        {
            return Write(MessageType.GetComments, comments);
        }

        private static string Write(MessageType type, object data)
        {
            Message temp = new Message(type, data);
            return temp.Serialize();
        }
    }
}
