using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProCoder.Data;
using ProCoder.Dtos;
using ProCoder.Model;
using System.Security.Claims;
using System.Xml.Linq;

namespace ProCoder.Controllers
{
    [Route("comment")]
    [ApiController]
    public class CommentController : Controller
    {
        private readonly IRepo _repository;
        public CommentController(IRepo repository)
        {
            _repository = repository;
        }

        //comment/GetAllComments
        [HttpGet("GetAllComments")]
        public ActionResult GetAllComments()
        {
            IEnumerable<Comment> comments = _repository.GetAllComments();
            if (comments == null || !comments.Any())
                return NotFound("No comment exists.");
            else
            {
                IEnumerable<CommentOutDto> c = comments.Select(e => new CommentOutDto { Photo = _repository.GetUser(e.UserID).Profile_Photo , QuestionID = e.QuestionID, CreatedDate = e.CreatedDate, UserId = e.UserID, CommentID = e.CommentID, CommentRating = e.CommentRating, CommentText = e.CommentText, Tags = e.Tags });
                return Ok(c);
            }
        }

        //comment/GetComment/{ID}
        [HttpGet("GetComment/{ID}")]
        public ActionResult GetComment(int Id)
        {
            Comment comment = _repository.GetCommentById(Id);
            if (comment == null)
                return NotFound("Comment Not Found.");
            else
            {
                CommentOutDto c = new CommentOutDto { Photo = _repository.GetUser(comment.UserID).Profile_Photo, QuestionID = comment.QuestionID, CreatedDate = comment.CreatedDate, UserId = comment.UserID, CommentID = comment.CommentID, CommentRating = comment.CommentRating, CommentText = comment.CommentText, Tags = comment.Tags };
                return Ok(c);
            }
        }

        //comment/GetComment/{UserID}
        [HttpGet("GetCommentByUserId/{UserID}")]
        public ActionResult GetCommentByUserId(int userid)
        {
            User user = _repository.GetUser(userid);
            int photo = user.Profile_Photo;
            IEnumerable<Comment> comments = _repository.GetCommentByUserId(userid);
            if (comments == null || !comments.Any())
                return NotFound("This user hasn't posted any comments yet.");
            else
            {
                IEnumerable<CommentOutDto> c = comments.Select(e => new CommentOutDto { Photo = photo, QuestionID = e.QuestionID, CreatedDate = e.CreatedDate, UserId = e.UserID, CommentID = e.CommentID, CommentRating = e.CommentRating, CommentText = e.CommentText, Tags = e.Tags });
                return Ok(c);
            }
        }

        //comment/GetCommentByQuestionID/{QuestionID}
        [HttpGet("GetCommentByQuestionID/{QuestionID}")]
        public ActionResult GetCommentByQuestionID(int questionId)
        {
            IEnumerable<Comment> comments = _repository.GetCommentByQuestionID(questionId);
            if (comments == null || !comments.Any())
                return NotFound("This question doesn't have any comments.");
            else
            {
                IEnumerable<CommentOutDto> c = comments.Select(e => new CommentOutDto { Photo = _repository.GetUser(e.UserID).Profile_Photo, QuestionID = e.QuestionID, CreatedDate = e.CreatedDate, UserId = e.UserID, CommentID = e.CommentID, CommentRating = e.CommentRating, CommentText = e.CommentText, Tags = e.Tags });
                return Ok(c);
            }
        }

        //comment/GetCommentByName/{UserName}
        [HttpGet("GetCommentByName/{UserName}")]
        public ActionResult GetCommentByName(string username)
        {
            User user = _repository.GetUserByName(username);
            int photo = user.Profile_Photo;
            IEnumerable<Comment> comments = _repository.GetCommentByUserName(username);
            if (comments == null || !comments.Any())
                return NotFound("This question doesn't have any comments.");
            else
            {
                IEnumerable<CommentOutDto> c = comments.Select(e => new CommentOutDto { Photo = photo, QuestionID = e.QuestionID, CreatedDate = e.CreatedDate, UserId = e.UserID, CommentID = e.CommentID, CommentRating = e.CommentRating, CommentText = e.CommentText, Tags = e.Tags });
                return Ok(c);
            }
        }

        //comment/NewComment
        //user only (exclude admin)
        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpPost("NewComment")]
        public ActionResult NewComment(CommentInputDto comment)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.First();
            Claim claim = ci.FindFirst("userName");
            string username = claim.Value;
            User user = _repository.GetUserByName(username);
            if (_repository.GetQuesByQuesID(comment.QuestionId) == null)
            {
                return NotFound("There is no realated question id!");
            }
            Comment c = new Comment { UserID = user.UserID, CreatedDate = DateTime.Now, CommentText = comment.CommentText, CommentRating = comment.CommentRating, QuestionID = comment.QuestionId, Tags = comment.Tags };
            Comment newComment = _repository.AddComment(c);
            CommentOutDto co = new CommentOutDto { Photo = user.Profile_Photo, QuestionID = newComment.QuestionID, CreatedDate = newComment.CreatedDate, CommentID = newComment.CommentID, CommentRating = newComment.CommentRating, CommentText = newComment.CommentText, UserId = newComment.UserID, Tags = newComment.Tags };
            _repository.AddPoints(username, 5);
            return CreatedAtAction(nameof(GetComment), new { Id = co.CommentID }, co);
        }

        //comment/NewFollowComment
        // user only
        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpPost("NewFollowComment")]
        public ActionResult NewFollowComment(FollowCommentInputDto comment)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.First();
            Claim claim = ci.FindFirst("userName");
            string username = claim.Value;
            User user = _repository.GetUserByName(username);

            FollowComment c = new FollowComment { UserID = user.UserID, Following = comment.Following, IsLiked = comment.IsLiked, CommentID = comment.CommentID };
            FollowComment newComment = _repository.AddFollowComment(c);
            FollowCommentOutputDto co = new FollowCommentOutputDto { Photo = user.Profile_Photo, FollowCommentID = newComment.RecordID, UserID = user.UserID, Following = comment.Following, IsLiked = comment.IsLiked, CommentID = comment.CommentID };
            if (comment.Following != null)
            {
                _repository.AddPoints(username, 2);
            }
            return CreatedAtAction(nameof(GetComment), new { Id = co.FollowCommentID }, co);
        }

        //comment/GetFollowComment/{CommentID}
        [HttpGet("GetFollowComment/{CommentID}")]
        public ActionResult GetFollowComment(int commentID)
        {
            IEnumerable<FollowComment> comments = _repository.GetFollowCommentByCommentID(commentID);
            if (comments == null || !comments.Any())
                return NotFound("This comment doesn't have any follow up discussion.");
            else
            {
                IEnumerable<FollowCommentOutputDto> c = comments.Select(e => new FollowCommentOutputDto { Photo = _repository.GetUser(e.UserID).Profile_Photo, FollowCommentID = e.RecordID, CommentID = e.CommentID, UserID = e.UserID, Following = e.Following, IsLiked = e.IsLiked });
                return Ok(c);
            }
        }

        //comment/GetLikesComment/{UserID}
        [HttpGet("GetLikesComment/{UserID}")]
        public ActionResult GetLikesComment(int userId)
        {
            IEnumerable<Comment> comments = _repository.GetLikedComments(userId);
            IEnumerable<CommentOutDto> c = comments.Select(e => new CommentOutDto { QuestionID = e.QuestionID, CreatedDate = e.CreatedDate, UserId = e.UserID, CommentID = e.CommentID, CommentRating = e.CommentRating, CommentText = e.CommentText, Tags = e.Tags });
            return Ok(comments); 
        }

        //comment/IsLiked/{UserId}
        [HttpGet("GetLikesComment/{UserID}/{CommentID}")]
        public bool IsLiked(int commentId, int userId)
        {
            return _repository.IsLiked(commentId, userId);
        }

        //comment/Count/{UserName}
        [HttpGet("Count/{UserName}")]
        public int CountComment(string userName)
        {
            return _repository.GetNumberOfCommentByUserName(userName);
        }

        //comment/DislikeComment/{UserId}/{CommentID}
        [HttpDelete("DislikeComment/{UserId}/{CommentID}")]
        public ActionResult DislikeComment(int userId, int commentId)
        {
            FollowComment c = _repository.DisLikeComment(userId, commentId);
            return Ok(c);
        }
    }
}
