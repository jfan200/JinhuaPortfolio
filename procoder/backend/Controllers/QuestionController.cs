using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProCoder.Data;
using ProCoder.Dtos;
using System.Security.Claims;


namespace ProCoder.Controllers
{
    [Route("question")]
    [ApiController]
    public class QuestionController : Controller
    {
        private readonly IRepo _repo;
        public QuestionController(IRepo repo)
        {
            _repo = repo;
        }

        //question/GetQuesByUser
        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("GetQuesByUser")]
        public ActionResult GetQuesByUser()
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string userName = c.Value;

            IEnumerable<QuestionOutDto> quesionts = _repo.GetQuesByUserName(userName);
            if (quesionts.Any() == false)
            {
                return NotFound("You have not post any question yet!");
            }
            return Ok(quesionts);
        }



        //question/GetQuesByUserName
        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("GetQuesByUserName/{userName}")]
        public ActionResult GetQuesByUserName(string userName)
        {
            if (_repo.GetUserByName(userName) == null)
            {
                return NotFound("The username you have entered is not in the user table!");
            }


            IEnumerable<QuestionOutDto> quesionts = _repo.GetQuesByUserName(userName);
            if (quesionts == null)
            {
                return NotFound("You have not post any question yet!");
            }
            return Ok(quesionts);
        }



        //question/GetAllQuestions
        [HttpGet("GetAllQuestions")]
        public ActionResult GetAllQuestions()
        {
            return Ok(_repo.GetAllQuestions());
        }


        //question/GetQuesByQuesID
       
        [HttpGet("GetQuesByQuesID/{QuesID}")]
        public ActionResult GetQuesByQuesID(int QuesID)
        {
            QuestionOutDto ques = _repo.GetQuesByQuesID(QuesID);
            if (ques == null)
            {
                return NotFound("No such question ID!");
            }
            return Ok(ques);
        }



        //question/AddQuestion
        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpPost("AddQuestion")]
        public ActionResult AddQuestion(QuestioInputDto questioInput)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string username = c.Value;
            _repo.AddQuestion(questioInput, username);
            _repo.AddPoints(username, 10);
            return Ok("Successfully added!");
        }

        //question/Count/{UserName}
        [HttpGet("Count/{UserName}")]
        public int CountQuestion(string userName)
        {
            return _repo.GetNumberOfQuesByUserName(userName);
        }
    }
}

