using System.ComponentModel.DataAnnotations;

namespace ProCoder.Dtos
{
    public class UserInputDto
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public string Description { get; set; }
    }
}
