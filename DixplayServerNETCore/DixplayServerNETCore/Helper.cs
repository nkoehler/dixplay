using Fleck;
using System;
using System.Collections.Generic;
using System.Text;

namespace DixplayServerNETCore
{
    public static class Helper
    {
        public static int Timeout = 60000;

        public static string DateFormat = "yyyy-MM-ddTHH:mm:ssK";

        public static void Broadcast(this List<IWebSocketConnection> sockets, string message)
        {
            sockets.ForEach(socket => socket.Send(message));
        }
    }
}
