using System.ComponentModel.DataAnnotations;

namespace ProCoder.Dtos
{
    public class FollowCommentOutputDto
    {
        public int FollowCommentID { get; set; }
        public int UserID { get; set; }
        public int CommentID { get; set; }
        public bool IsLiked { get; set; }
        public string? Following { get; set; }
        public int Photo { get; set; }
    }
}
