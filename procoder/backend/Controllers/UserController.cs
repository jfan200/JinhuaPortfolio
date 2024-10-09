using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProCoder.Data;
using ProCoder.Dtos;
using ProCoder.Model;

namespace ProCoder.Controllers
{
    [Route("user")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IRepo _repository;
        public UserController(IRepo repository)
        {
            _repository = repository;
        }

        //user/GetAllUsers
        //admin only
        [Authorize(AuthenticationSchemes = "AdminAuthentication")]
        [Authorize(Policy = "AdminOnly")]
        [HttpGet("GetAllUsers")]
        public ActionResult<IEnumerable<UserOutDto>> GetAllUsers()
        {
            IEnumerable<User> users = _repository.GetAllUsers();
            IEnumerable<UserOutDto> c = users.Select(e => new UserOutDto
            {
                UserID = e.UserID,
                UserName = e.UserName,
                Email = e.Email,
                UserPhoto = e.Profile_Photo,
                point = e.point,
            });
            return Ok(c);
        }

        [HttpGet("GetUser/{UserName}")]
        public ActionResult GetUser(string userName)
        {
            User user = _repository.GetUserByName(userName);
            if (user == null)
                return NotFound("User Not Found.");
            else
            {
                UserOutDto u = new() { UserID = user.UserID, UserName = user.UserName, Email = user.Email, UserPhoto = user.Profile_Photo,Description=user.Description, point=user.point};
                return Ok(u);
            }
        }

        //user/NewUser
        [HttpPost("NewUser")]
        public ActionResult NewUser(UserInputDto user)
        {
            User u = new() {
                CreatedDate = DateTime.Now,
                UserName = user.UserName,
                Email = user.Email,
                Password = user.Password,
                Profile_Photo = 1,
                Description = "",
                point = 0,
                Verified = false
            };

            UserValidator validator = new();
            ValidationResult results = validator.Validate(u);

            if (!results.IsValid)
            {
                foreach (var failure in results.Errors)
                {
                    Console.WriteLine("Property " + failure.PropertyName + " failed validation. Error was: " + failure.ErrorMessage);
                }
                return BadRequest();
            }

            if (_repository.GetUserByName(user.UserName) != null)
            {
                return BadRequest("Username already exist!");
            }

            if (_repository.GetUserByEmail(user.Email) != null)
            {
                return BadRequest("Email already used!");
            }

            User newUser = _repository.AddUser(u);
            UserOutDto uo = new() { UserID = newUser.UserID, UserName = newUser.UserName, Email = newUser.Email, UserPhoto = newUser.Profile_Photo,point=newUser.point };
            return CreatedAtAction(nameof(GetUser), new { UserName = uo.UserName }, uo);
        }

        //user/GetUserPhoto/{userId}
        [HttpGet("GetUserPhoto/{userId}")]
        public ActionResult GetUserPhoto(int userId)
        {
            User user = _repository.GetUser(userId);
            if (user == null)
                return NotFound("User Not Found.");
            else
            {
                int userPhotoId = user.Profile_Photo;
                return GetPhoto(userPhotoId);
            }
        }

        //user/GetPhoto/{id}
        [HttpGet("GetPhoto/{id}")]
        public ActionResult GetPhoto(int id)
        {
            string path = Directory.GetCurrentDirectory();
            string DirPath = Path.Combine(Path.Combine(path, "Template"), "Photo");
            string htmlPath = Path.Combine(DirPath, id + ".png");

            if (System.IO.File.Exists(htmlPath))
            {
                return PhysicalFile(htmlPath, "image/png");
            }
            else
            {
                return PhysicalFile(Path.Combine(DirPath, "1.png"), "image/png");
            }
        }

        //user/ChangePhoto/{userId}/{newId}
        [HttpPost("ChangePhoto/{userId}/{newId}")]
        public ActionResult ChangePhoto(int userId, int newId)
        {
            User u = _repository.ChangePhoto(userId, newId);
            return Ok(u);
        }

        //user/ChangeDescription
        [HttpPost("ChangeDescription")]
        public ActionResult ChangeDescription(UserInputDto user)
        {
            User u = _repository.ChangeDescription(user);
            return Ok(u);
        }

        //user/GetRanking
        [HttpGet("GetRanking")]
        public ActionResult GetRanking()
        {
            return Ok(_repository.GetRanking());
        }
    }
}
