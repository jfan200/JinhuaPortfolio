using System.ComponentModel.DataAnnotations;

namespace ProCoder.Dtos
{
    public class AdminInputDto
    {
        [Required]
        public string AdminName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
