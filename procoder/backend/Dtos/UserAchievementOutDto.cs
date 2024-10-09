namespace ProCoder.Dtos
{
    public class UserAchievementOutDto
    {
        public int AchievementId { get; set; }
        public int AchieveID { get; set; }
        public int UserID { get; set; }

        public string UserName { get; set; }
        public string AchieveName { get; set; }
        public string AchieveDes { get; set; }
       public DateTime AchieveDate { get; set; }

    }
}
