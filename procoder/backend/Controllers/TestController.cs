using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProCoder.Data;
using ProCoder.Dtos;
using ProCoder.Model;
using FluentValidation.Results;
using FluentValidation;

namespace ProCoder.Controllers
{

    [Route("api")]
    [ApiController]
    public class TestController : Controller
    {

        private readonly IRepo _repo;

        public TestController(IRepo repo)
        {
            _repo = repo;
        }


        //api/GetVersion
        [HttpGet("GetVersion")]
        public ActionResult GetVersion()
        {
            return Ok("1.0.0");
        }


        //api/GetVersionA
        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("GetVersionA")]
        public ActionResult GetVersionA()
        {
            return Ok("1.0.0 (auth)");
        }
        //UserName：admin
        //Password：admin


        //api/AddAdmin
        [HttpPost("AddAdmin")]
        public ActionResult AddAdmin(AdminInputDto admin)
        {
            AdminUser a = new AdminUser { Email = admin.Email, Password = admin.Password, AdminName = admin.AdminName };

            AdminValidator validator = new AdminValidator();
            ValidationResult results = validator.Validate(a);

            if (!results.IsValid)
            {
                foreach (var failure in results.Errors)
                {
                    Console.WriteLine("Property " + failure.PropertyName + " failed validation. Error was: " + failure.ErrorMessage);
                }
                return BadRequest();
            }

            AdminUser newAdmin = _repo.AddAdmin(a);
            AdminOutputDto ao = new AdminOutputDto { AdminID = newAdmin.AdminID, AdminName = newAdmin.AdminName, Email = newAdmin.Email };
            
            return Ok(ao);
        }



    }
}

