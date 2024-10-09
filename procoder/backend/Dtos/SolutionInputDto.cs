using System.ComponentModel.DataAnnotations;
using ProCoder.Model;

namespace ProCoder.Dtos
{
    public class SolutionInputDto
    {
        public int QuestionID { get; set; }
        public bool Status { get; set; }

        //Entered by the User
        [Required]
        public string SolutionContext { get; set; }
        public string Tags { get; set; }
    }
}

