using System;
using System.Collections.Generic;
using System.Text;

namespace DixplayServerNETCore.ServerModels
{
    public class Votable
    {
        public string ID { get; set; }
        public string Expires { get; set; }
        public Photo[] Photos { get; set; }

        public Votable()
        {
            ID = Guid.NewGuid().ToString();
            Photos = new Photo[] { };
        }
    };
}
