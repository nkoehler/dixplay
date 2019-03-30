using DixplayServerNETCore.ClientModels;
using DixplayServerNETCore.ServerModels;
using Fleck;
using Newtonsoft.Json;
using System;
using System.Linq;

namespace DixplayServerNETCore
{
    class Server
    {
        static void Main(string[] args)
        {
            if (!args.Contains("debug")) FleckLog.LogAction = (level, message, ex) => { };

            Console.WriteLine("------------------------- Dixplay Server -------------------------");

            // Init
            State state = new State();

            // Server
            WebSocketServer server = new WebSocketServer("ws://0.0.0.0:8008");

            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    state.Sockets.Add(socket);

                    socket.Send(Message.Build(state.Photo));
                    socket.Send(Message.Build(state.Comments));
                    socket.Send(Message.Build(state.Votable));
                };
                socket.OnClose = () =>
                {
                    state.Sockets.Remove(socket);
                };
                socket.OnMessage = message =>
                {
                    Message mail = new Message(message);

                    if (mail.Type == MessageType.UploadPhoto)
                    {
                        var photo = new Photo(JsonConvert.DeserializeObject<UploadPhoto>(mail.Payload));

                        state.UploadPhoto(photo);
                    }

                    else if (mail.Type == MessageType.UploadComment)
                    {
                        var comment = new Comment(JsonConvert.DeserializeObject<UploadComment>(mail.Payload));

                        state.UploadComment(comment);
                    }

                    else if (mail.Type == MessageType.UploadVote)
                    {
                        var vote = JsonConvert.DeserializeObject<UploadVote>(mail.Payload);

                        state.UploadVote(vote.ID);
                    }
                };
            });

            Console.WriteLine();
            Console.Write("Dixplay > ");
            string input = Console.ReadLine();
            while (input != "exit")
            {
                Console.Write("Dixplay > ");
                input = Console.ReadLine();
            }
        }
    }
}