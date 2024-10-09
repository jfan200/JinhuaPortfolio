using System.ComponentModel.DataAnnotations;

namespace ProCoder.Dtos
{
    public class FollowCommentInputDto
    {
        public int CommentID { get; set; }
        public bool IsLiked { get; set; }
        public string? Following { get; set; } // follow-up discussion
    }
}