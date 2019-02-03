using DixplayServerNETCore.ClientModels;
using System;

namespace DixplayServerNETCore.ServerModels
{
    public class Photo
    {
        public string Data { get; set; }
        public DateTime Date { get; set; }

        public Photo() { }

        public Photo(UploadPhoto photo)
        {
            Data = photo.Data;
            Date = DateTime.Now;
        }
    }
}
