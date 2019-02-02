using System;
using System.Collections.Generic;
using System.IO;

namespace DixplayServerNETCore.ServerModels
{
    public class Dixplay
    {
        public string Photo { get; set; }

        public LinkedList<string> Comments { get; set; }

        public Dixplay()
        {
            Photo = "data:*/*;base64," + Convert.ToBase64String(File.ReadAllBytes("default.jpg"));
            Comments = new LinkedList<string>();
        }
    }
}
