using ProCoder.Dtos;
using ProCoder.Model;
using System.ComponentModel.Design;

namespace ProCoder.Data
{
    public interface IRepo
    {
        // Login
        public bool ValidLogin(string userName, string password);
        public bool ValidAdminLogin(string userName, string password);


        // Admin
        AdminUser AddAdmin(AdminUser adminUser);


        // User
        IEnumerable<User> GetAllUsers();
        User GetUser(int id);
        User GetUserByName(string username);
        User GetUserByEmail(string email);
        User AddUser(User user);
        User ChangePhoto(int userId, int id);
        User ChangeDescription(UserInputDto user);
        User AddPoints(string userName, int point);
        IEnumerable<User> GetRanking();

        //Question methods
        public IEnumerable<QuestionOutDto> GetQuesByUserName(string userName);
        public IEnumerable<QuestionOutDto> GetQuesByName(string name);
        public IEnumerable<QuestionOutDto> GetAllQuestions();
        public QuestionOutDto GetQuesByQuesID(int QuesID);
        public Question AddQuestion(QuestioInputDto QuestionIn, string userName);
        public int GetNumberOfQuesByUserName(string userName);
        public void UpdateAllQuestionAchievement(User user);
        public bool QuestionAchievement(User user, int numberOfQues, int AchieveID);


        //Solution methods
        public IEnumerable<SolutionOutDto> GetSolusByUserName(string userName);
        public IEnumerable<SolutionOutDto> GetSolusByQuestionID(int QuestionID);
        public Solution AddSolution(SolutionInputDto SolutionIn, string userName);
        public int GetNumberOfSolusByUserName(string userName);
        public void UpdateAllSolusAchievement(User user);
        public bool SoluAchievement(User user, int numberOfSolus, int AchieveID);


        // Comment
        IEnumerable<Comment> GetAllComments();
        Comment GetCommentById(int id);
        IEnumerable<Comment> GetCommentByUserId(int userid);
        IEnumerable<Comment> GetCommentByUserName(string userName);
        IEnumerable<Comment> GetCommentByQuestionID(int questionID);
        Comment AddComment(Comment comment);
        int GetNumberOfCommentByUserName(string userName);


        // FollowComment
        FollowComment AddFollowComment(FollowComment comment);
        IEnumerable<FollowComment> GetFollowCommentByCommentID(int commentID);
        IEnumerable<Comment> GetLikedComments(int userId);
        bool IsLiked(int userId, int commentId);
        FollowComment DisLikeComment(int userId, int commentId);

        //UserAchievement
        IEnumerable<UserAchievement> GetAllUserAchievements();
        UserAchievement GetUserAchievementById(int Id);
        IEnumerable<UserAchievement> GetUserAchievementsByUserId(int UserId);

        IEnumerable<UserAchievement> GetUserAchievementsByUserName(string userName);
        IEnumerable<UserAchievement> GetUserAchievementsByAchieveID(int AchieveId);
        IEnumerable<UserAchievement> GetUserAchievementByAchieveName(string AchievementName);
        IEnumerable<UserAchievement> GetUserAchievementsByAchieveDate(DateTime date);
        UserAchievement AddUserAchievement(UserAchievement userAchievement);

        //Achievement
        IEnumerable<Achievement> GetAchievementsByAchieveName(string achieveName);
        Achievement GetAchievementByAchieveID(int achieveID);
        Achievement AddAchievement(Achievement achievement);


        //Tag
        IEnumerable<Tag> GetTags();
    }
}

