using ProCoder.Model;

namespace ProCoder.Dtos
{
    public class QuestioInputDto
    {
        public string QuestionTitle { get; set; }

        public string Description { get; set; }
        public string TestCase { get; set; }
        
        public string Tags { get; set; }

        public string Difficulty_level { get; set; }
        public string RunMethod { get; set; }

        //Optional for users
        public string? SampleSolution { get; set; }
    }
}

