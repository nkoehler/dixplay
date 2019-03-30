using DixplayServerNETCore.ClientModels;
using DixplayServerNETCore.ServerModels;
using Fleck;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;

namespace DixplayServerNETCore
{
    public class State
    {
        public List<IWebSocketConnection> Sockets;

        public Photo Photo;

        public LinkedList<Comment> Comments;

        public Votable Votable;

        private Timer timer;

        public State()
        {
            Sockets = new List<IWebSocketConnection>();

            Photo = new Photo
            {
                Data = "data:image/png;base64," + Convert.ToBase64String(File.ReadAllBytes("empty.png")),
                Date = DateTime.Now
            };

            Comments = new LinkedList<Comment>();

            using (var db = new DataContext())
            {
                db.Database.EnsureCreated();

                var photos = db.Photos.ToArray();

                Votable = new Votable();

                if (photos.Length > 0)
                {
                    Votable.Expires = DateTime.Now.AddMilliseconds(Helper.Timeout).ToString(Helper.DateFormat);
                    Votable.Photos = photos;

                    timer = new Timer(e =>
                    {
                        ChangePhoto();
                        timer.Dispose();
                        timer = null;
                    }, null, Helper.Timeout, Timeout.Infinite);
                }

            }
        }

        public void UploadPhoto(Photo photo)
        {
            using (var db = new DataContext())
            {
                db.Photos.Add(photo);
                db.SaveChanges();

                if (timer == null)
                {
                    Votable.Expires = DateTime.Now.AddMilliseconds(Helper.Timeout).ToString(Helper.DateFormat);

                    timer = new Timer(e => 
                    {
                        ChangePhoto();
                        timer.Dispose();
                        timer = null;
                    }, null, Helper.Timeout, Timeout.Infinite);
                }

                Votable.Photos = db.Photos.ToArray();

                Sockets.Broadcast(Message.Build(Votable));
            }
        }


        private void ChangePhoto()
        {
            using (var db = new DataContext())
            {
                Photo = db.Photos.OrderByDescending(i => i.Votes).First();
                Comments = new LinkedList<Comment>();
                Votable = new Votable();

                db.Photos.RemoveRange(db.Photos.ToArray());
                db.SaveChanges();

                Sockets.Broadcast(Message.Build(Photo));
                Sockets.Broadcast(Message.Build(Comments));
                Sockets.Broadcast(Message.Build(Votable));
            }
        }

        public void UploadComment(Comment comment)
        {
            Comments.AddFirst(comment);
            Sockets.Broadcast(Message.Build(Comments));
        }

        public void UploadVote(long id)
        {
            using (var db = new DataContext())
            {
                var photo = db.Photos.Single(x => x.ID == id);

                if (photo != null)
                {
                    photo.Votes = photo.Votes + 1;
                    db.SaveChanges();
                }

                Votable.Photos = db.Photos.ToArray();

                Sockets.Broadcast(Message.Build(Votable));
            }
        }
    }
}
