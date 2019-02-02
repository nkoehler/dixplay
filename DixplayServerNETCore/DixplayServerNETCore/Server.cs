using DixplayServerNETCore.ClientModels;
using DixplayServerNETCore.ServerModels;
using Fleck;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
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
            Dixplay dixplay = new Dixplay();

            // Server
            List<IWebSocketConnection> sockets = new List<IWebSocketConnection>();
            WebSocketServer server = new WebSocketServer("ws://0.0.0.0:8008");

            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    // Add socket
                    sockets.Add(socket);

                    socket.Send(Message.Build(dixplay));
                };
                socket.OnClose = () =>
                {
                    // Remove socket
                    sockets.Remove(socket);
                };
                socket.OnMessage = message =>
                {
                    Message mail = new Message(message);

                    if(mail.Type == MessageType.UploadPhoto)
                    {
                        dixplay.Photo = JsonConvert.DeserializeObject<UploadPhoto>(mail.Payload).Data;
                        dixplay.Comments = new LinkedList<string>();

                        Broadcast(sockets, Message.Build(dixplay));
                    }

                    else if(mail.Type == MessageType.UploadComment)
                    {
                        dixplay.Comments.AddFirst(JsonConvert.DeserializeObject<UploadComment>(mail.Payload).Comment);

                        Broadcast(sockets, Message.Build(dixplay.Comments));
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

        static void Broadcast(List<IWebSocketConnection> sockets, string message)
        {
            sockets.ForEach(socket => socket.Send(message));
        }
    }
}
