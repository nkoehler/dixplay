using Newtonsoft.Json;
using System.Collections.Generic;

namespace DixplayServerNETCore.ServerModels
{
    public enum MessageType
    {
        // 100 level is User -> Server messages
        UploadPhoto = 101, // new photo
        UploadComment = 102, // new comment
        UploadVote = 103, // new vote

        // 200 level is Server -> User messages
        GetPhoto = 201, // photo
        GetComments = 202, // updated comments
        GetVotable = 203, // votable photos
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

        public static string Build(Photo photo)
        {
            return Write(MessageType.GetPhoto, photo);
        }

        public static string Build(LinkedList<Comment> comments)
        {
            return Write(MessageType.GetComments, comments);
        }

        public static string Build(Votable votable)
        {
            return Write(MessageType.GetVotable, votable);
        }

        private static string Write(MessageType type, object data)
        {
            Message temp = new Message(type, data);
            return temp.Serialize();
        }
    }
}
