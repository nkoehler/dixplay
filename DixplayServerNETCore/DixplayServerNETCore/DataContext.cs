using DixplayServerNETCore.ServerModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DixplayServerNETCore
{
    public class DataContext : DbContext
    {
        public DbSet<Photo> Photos { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=Dixplay.db");
        }
    }
}
