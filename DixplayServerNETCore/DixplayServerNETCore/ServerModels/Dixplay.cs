using System;
using System.Collections.Generic;
using System.IO;

namespace DixplayServerNETCore.ServerModels
{
    public class Dixplay
    {
        public Photo Photo { get; set; }

        public LinkedList<Comment> Comments { get; set; }

        public Dixplay()
        {
            Photo = new Photo
            {
                Data = "data:*/*;base64," + Convert.ToBase64String(File.ReadAllBytes("default.jpg")),
                Date = DateTime.Now
            };
            Comments = new LinkedList<Comment>();
        }
    }
}
