using DixplayServerNETCore.ClientModels;
using System;

namespace DixplayServerNETCore.ServerModels
{
    public class Comment
    {
        public string Name { get; set; }
        public string Text { get; set; }
        public DateTime Date { get; set; }

        public Comment() { }

        public Comment(UploadComment comment)
        {
            Name = comment.Name;
            Text = comment.Text;
            Date = DateTime.Now;
        }
    }
}
