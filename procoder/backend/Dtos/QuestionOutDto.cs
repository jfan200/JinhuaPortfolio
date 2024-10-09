using ProCoder.Model;

namespace ProCoder.Dtos
{
    public class QuestionOutDto
    {
        public int QuestionID { get; set; }
        public string UserName { get; set; }
        public string QuestionTitle { get; set; }
        public string Description { get; set; }
        public string RunMethod { get; set; }
        public string TestCase { get; set; }
        public string Tags { get; set; }
        public string? SampleSolution { get; set; }
        public DateTime PostDate { get; set; }
        public string Difficulty_level { get; set; }
    }
}

