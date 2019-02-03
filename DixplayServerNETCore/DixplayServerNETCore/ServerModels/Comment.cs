using DixplayServerNETCore.ClientModels;
using System;

namespace DixplayServerNETCore.ServerModels
{
    public class Comment
    {
        public string Text { get; set; }
        public DateTime Date { get; set; }

        public Comment() { }

        public Comment(UploadComment comment)
        {
            Text = comment.Text;
            Date = DateTime.Now;
        }
    }
}
