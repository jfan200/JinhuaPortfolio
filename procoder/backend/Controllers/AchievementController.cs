using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProCoder.Data;
using ProCoder.Model;

namespace ProCoder.Controllers
{
    [Route("achievement")]
    [ApiController]
    public class AchievementController : Controller
    {
        private readonly IRepo _repo;
        public AchievementController(IRepo repo)
        {
            _repo = repo;
        }


        [HttpGet("GetAchievementByAchieveName/{name}")]
        public ActionResult<IEnumerable<Achievement>> GetAchievementsByAchieveName(string name)
        {
            IEnumerable<Achievement> achievements = _repo.GetAchievementsByAchieveName(name);
            if (achievements.Any() == false)
            {
                return NotFound("Achievements not found!");
            }
            else
            {
                return Ok(achievements);
            }
        }

        [Authorize(AuthenticationSchemes = "AdminAuthentication")]
        [Authorize(Policy = "AdminOnly")]
        [HttpPost("AddAchievement")]
        public ActionResult<Achievement> AddAchievement(Achievement achievement)
        {
            return Ok(_repo.AddAchievement(achievement));
        }
    }
}
