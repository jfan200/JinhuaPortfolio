using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProCoder.Data;
using ProCoder.Dtos;
using System.Security.Claims;

namespace ProCoder.Controllers
{
    [Route("solution")]
    [ApiController]
    public class SolutionController : Controller
    {
        private readonly IRepo _repo;
        public SolutionController(IRepo repo)
        {
            _repo = repo;
        }


        //solution/GetSolusByUser
        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("GetSolusByUser")]
        public ActionResult GetSolusByUser()
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string userName = c.Value;

            IEnumerable<SolutionOutDto> solutions = _repo.GetSolusByUserName(userName);
            if (solutions.Any() == false)
            {
                return NotFound("You have not answer any question yet!");
            }
            return Ok(solutions);
        }



        //solution/GetSolusByUserName
    
        [HttpGet("GetSolusByUserName/{userName}")]
        public ActionResult GetSolusByUserName(string userName)
        {
            if (_repo.GetUserByName(userName) == null)
            {
                return NotFound("The username you have entered is not in the user table!");
            }

            IEnumerable<SolutionOutDto> solutions = _repo.GetSolusByUserName(userName);
            if (solutions.Any() == false)
            {
                return NotFound("You have not answer any question yet!");
            }
            return Ok(solutions);
        }



        //solution/AddSolution
        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpPost("AddSolution")]
        public ActionResult AddSolution(SolutionInputDto solutionIn)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string userName = c.Value;
            if(solutionIn.Status == true)
            {
                _repo.AddPoints(userName, 8);

            }
            
            return Ok(_repo.AddSolution(solutionIn, userName));
        }



        //solution/GetSolusByQuestionID
        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("GetSolusByQuestionID/{QuestionID}")]
        public ActionResult GetSolusByQuestionID(int QuestionID)
        {
            QuestionOutDto ques = _repo.GetQuesByQuesID(QuestionID);
            if (ques == null)
            {
                return NotFound("No such solution ID");
            }

            IEnumerable<SolutionOutDto> solu = _repo.GetSolusByQuestionID(QuestionID);

            if (solu.Any() == false)
            {
                return NotFound("No solutions yet");
            }
            return Ok(solu);
        }

        [HttpGet("Count/{UserName}")]
        public int CountSolution(string userName)
        {
            return _repo.GetNumberOfSolusByUserName(userName);
        }
    }
}

