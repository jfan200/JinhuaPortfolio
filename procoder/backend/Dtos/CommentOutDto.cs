using ProCoder.Model;

namespace ProCoder.Dtos
{
    public class CommentOutDto
    {
        public int QuestionID {get;set;}
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string? CommentText { get; set; }
        public int CommentRating { get; set; }
        public int CommentID { get; set; }
        public string Tags { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Photo { get; set;}
    }
}
