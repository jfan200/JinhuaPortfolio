using ProCoder.Model;

namespace ProCoder.Dtos
{
    public class SolutionOutDto
    {
        public int SolutionID { get; set; }
        public string userName { get; set; }
        public int QuestionID { get; set; }

        public string QuestionTitle { get; set; }
        public bool Status { get; set; }
        public DateTime SubmitDate { get; set; }
        public string SolutionContext { get; set; }
        public string Tags { get; set; }
    }
}

