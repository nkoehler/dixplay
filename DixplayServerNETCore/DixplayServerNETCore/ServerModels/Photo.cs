using DixplayServerNETCore.ClientModels;
using System;

namespace DixplayServerNETCore.ServerModels
{
    public class Photo
    {
        public long ID { get; set; }
        public long Votes { get; set; }
        public string Data { get; set; }
        public DateTime Date { get; set; }

        public Photo() { }

        public Photo(UploadPhoto photo)
        {
            Votes = 0;
            Data = photo.Data;
            Date = DateTime.Now;
        }
    }
}
