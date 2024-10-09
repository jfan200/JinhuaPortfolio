using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProCoder.Data;
using ProCoder.Dtos;
using ProCoder.Model;



namespace ProCoder.Controllers
{
    [Route("userAchievement")]
    [ApiController]
    public class UserAchievementController : Controller
    {
        private readonly IRepo _repo;
        public UserAchievementController(IRepo repo)
        {
            _repo = repo;
        }
        //userAchievement/GetAllUserAchievements
        [HttpGet("GetAllUserAchievements")]
        public ActionResult<IEnumerable<UserAchievementOutDto>> GetAllUserAchievements()
        {
            IEnumerable<UserAchievement> userAchievements = _repo.GetAllUserAchievements();
            IEnumerable<UserAchievementOutDto> uao = userAchievements.Select(e => new UserAchievementOutDto
            {
                AchievementId = e.AchievementId,
                AchieveID = e.AchieveID,
                UserID = e.UserID,
                UserName = e.UserName,
                AchieveName = e.AchieveName,
                AchieveDes = e.AchieveDes,
                AchieveDate = e.AchieveDate
            });
            return Ok(uao);

        }

        //userAchievement/GetUserAchievementById/{Id}
        [HttpGet("GetUserAchievementById/{Id}")]
        public ActionResult<UserAchievementOutDto> GetUserAchievementById(int Id)
        {
            UserAchievement userAchievement = _repo.GetUserAchievementById(Id);
            if (userAchievement == null)
            {
                return NotFound();
            }
            else
            {
                UserAchievementOutDto uao = new UserAchievementOutDto
                {
                    AchievementId = userAchievement.AchievementId,
                    AchieveID = userAchievement.AchieveID,
                    UserID = userAchievement.UserID,
                    UserName= userAchievement.UserName,
                    AchieveName = userAchievement.AchieveName,
                    AchieveDes = userAchievement.AchieveDes,
                  
                    AchieveDate = userAchievement.AchieveDate
                };
                return Ok(uao);
            }
        }

        //userAchievement/GetUserAchievementsByUserId/{UserID}
        [HttpGet("GetUserAchievementsByUserId/{UserID}")]
        public ActionResult<IEnumerable<UserAchievementOutDto>> GetUserAchievementsByUserId(int UserId)
        {
            IEnumerable<UserAchievement> userAchievements = _repo.GetUserAchievementsByUserId(UserId);
            if (userAchievements == null)
            {
                return NotFound();
            }

            else
            {
                IEnumerable<UserAchievementOutDto> uao = userAchievements.Select(e => new UserAchievementOutDto
                {
                    AchievementId = e.AchievementId,
                    AchieveID = e.AchieveID,
                    UserID = e.UserID,
                    UserName = e.UserName,
                    AchieveName = e.AchieveName,
                    AchieveDes = e.AchieveDes,
                  
                    AchieveDate = e.AchieveDate
                });
                return Ok(uao);
            }
        }

        [HttpGet("GetUserAchievementsByUserName/{UserName}")]
        public ActionResult<IEnumerable<UserAchievementOutDto>> GetUserAchievementsByUserName(string userName)
        {
            IEnumerable<UserAchievement> userAchievements = _repo.GetUserAchievementsByUserName(userName);
            if (userAchievements == null)
            {
                return NotFound();
            }

            else
            {
                IEnumerable<UserAchievementOutDto> uao = userAchievements.Select(e => new UserAchievementOutDto
                {
                    AchievementId = e.AchievementId,
                    AchieveID = e.AchieveID,
                    UserID = e.UserID,
                    UserName = e.UserName,
                    AchieveName = e.AchieveName,
                    AchieveDes = e.AchieveDes,
                    AchieveDate = e.AchieveDate
                });
                return Ok(uao);
            }
        }



        [HttpGet("GetUserAchievementByAchieveName/{AchievementName}")]
        public ActionResult<IEnumerable<UserAchievementOutDto>> GetUserAchievementByAchieveName(string AchievementName)
        {
            IEnumerable<UserAchievement> userAchievements = _repo.GetUserAchievementByAchieveName(AchievementName);
            if(userAchievements.Any() == false)
            {
                return NotFound("You have not achieve anything yet!");
            }
            else
            {
                IEnumerable<UserAchievementOutDto> uao = userAchievements.Select(e => new UserAchievementOutDto
                {
                    AchievementId = e.AchievementId,
                    AchieveID = e.AchieveID,
                    UserID = e.UserID,
                    UserName=e.UserName,
                    AchieveName = e.AchieveName,
                    AchieveDes = e.AchieveDes,

                    AchieveDate = e.AchieveDate
                });
                return Ok(uao);

            }
        }

        //userAchievement/GetUserAchievementsByAchieveID/{AchieveID}
        [HttpGet("GetUserAchievementsByAchieveID/{AchieveID}")]
        public ActionResult<IEnumerable<UserAchievement>> GetUserAchievementsByAchieveID(int AchieveId)
        {
            IEnumerable<UserAchievement> userAchievements = _repo.GetUserAchievementsByAchieveID(AchieveId);
            if (userAchievements == null)
            {
                return NotFound();
            }

            else
            {
                IEnumerable<UserAchievementOutDto> uao = userAchievements.Select(e => new UserAchievementOutDto
                {
                    AchievementId = e.AchievementId,
                    AchieveID = e.AchieveID,
                    UserID = e.UserID,
                    UserName = e.UserName,
                    AchieveName = e.AchieveName,
                    AchieveDes = e.AchieveDes,
                   
                    AchieveDate = e.AchieveDate
                });
                return Ok(uao);
            }
        }

       //AddUserAchiement still in discussion






    }
    
}
