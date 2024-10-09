using System;
using System.ComponentModel.DataAnnotations;

namespace ProCoder.Model
{
    public class Tag
    {
        [Key]
        [Required]
        public string TagName { get; set; }
    }
}

