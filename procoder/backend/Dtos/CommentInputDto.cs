using System.ComponentModel.DataAnnotations;
using ProCoder.Model;

namespace ProCoder.Dtos
{
    public class CommentInputDto
    {
        public int QuestionId { get; set; }
        public string? CommentText { get; set; }
        [Required]
        public int CommentRating { get; set; }
        public string Tags { get; set; }
    }
}
