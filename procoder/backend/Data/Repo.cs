using Microsoft.EntityFrameworkCore.ChangeTracking;
using ProCoder.Dtos;
using ProCoder.Model;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace ProCoder.Data
{
    public class Repo : IRepo
    {

        private readonly MyDbContext _dbContext;

        public Repo(MyDbContext dBContext)
        {
            _dbContext = dBContext;
        }


        // Login
        public bool ValidLogin(string userName, string password)
        {
            return _dbContext.Users.Any(e => e.UserName == userName && e.Password == password);
        }
        public bool ValidAdminLogin(string userName, string password)
        {
            return _dbContext.AdminUsers.Any(e => e.AdminName == userName && e.Password == password);
        }


        // AdminUser
        public AdminUser AddAdmin(AdminUser adminUser)
        {
            EntityEntry<AdminUser> e = _dbContext.AdminUsers.Add(adminUser);
            AdminUser a = e.Entity;
            _dbContext.SaveChanges();
            return a;
        }


        // User
        public IEnumerable<User> GetAllUsers()
        {
            IEnumerable<User> users = _dbContext.Users.ToList();
            return users;
        }
        public User GetUser(int id)
        {
            User user = _dbContext.Users.First(e => e.UserID == id);
            return user;
        }
        public User GetUserByName(string name)
        {
            User user = _dbContext.Users.FirstOrDefault(e => e.UserName == name);
            return user;
        }
        public User GetUserByEmail(string email)
        {
            User user = _dbContext.Users.FirstOrDefault(e => e.Email == email);
            return user;
        }
        public User AddUser(User user)
        {
            EntityEntry<User> e = _dbContext.Users.Add(user);
            User u = e.Entity;
            _dbContext.SaveChanges();
            return u;
        }
        public User ChangePhoto(int userId, int id)
        {
            User user = _dbContext.Users.FirstOrDefault(e => e.UserID == userId);
            user.Profile_Photo = id;
            EntityEntry<User> e = _dbContext.Users.Update(user);
            User updateUser = e.Entity;
            _dbContext.SaveChanges();
            return updateUser;
        }
        public User ChangeDescription(UserInputDto u)
        {
            User user = _dbContext.Users.FirstOrDefault(e => e.UserName == u.UserName);
            user.Description = u.Description;
            EntityEntry<User> e = _dbContext.Users.Update(user);
            User updateUser = e.Entity;
            _dbContext.SaveChanges();
            return updateUser;
        }
        public User AddPoints(string userName, int point)
        {
            User user = _dbContext.Users.FirstOrDefault(e => e.UserName == userName);
            user.point = user.point + point;
            EntityEntry<User> e = _dbContext.Users.Update(user);
            User updateUser = e.Entity;
            _dbContext.SaveChanges();
            return updateUser;
        }
        public IEnumerable<User> GetRanking()
        {
            List<User> users = _dbContext.Users.ToList();
            var qry = from u in users
                      orderby u.point descending
                      select u;
            return qry.Take(10);
        }

        // Comment
        public IEnumerable<Comment> GetAllComments()
        {
            IEnumerable<Comment> comments = _dbContext.Comments.ToList();
            return comments;
        }
        public Comment GetCommentById(int id)
        {
            Comment comment = _dbContext.Comments.FirstOrDefault(e => e.CommentID == id);
            return comment;
        }
        public Comment AddComment(Comment comment)
        {
            EntityEntry<Comment> e = _dbContext.Comments.Add(comment);
            Comment c = e.Entity;
            _dbContext.SaveChanges();
            UpdateAllCommentAchievement(GetUser(comment.UserID));
            return c;
        }
        public IEnumerable<Comment> GetCommentByUserId(int userid)
        {
            IEnumerable<Comment> comments = _dbContext.Comments.Where(e => e.UserID == userid);
            return comments;
        }
        public IEnumerable<Comment> GetCommentByQuestionID(int questionID)
        {
            IEnumerable<Comment> comments = _dbContext.Comments.Where(e => e.QuestionID == questionID);
            return comments;
        }
        public IEnumerable<Comment> GetCommentByUserName(string userName)
        {
            User user = GetUserByName(userName);
            IEnumerable<Comment> comments = _dbContext.Comments.Where(e => e.UserID == user.UserID);
            return comments;
        }
        public int GetNumberOfCommentByUserName(string userName)
        {
            return GetCommentByUserName(userName).Count();
        }
        public void UpdateAllCommentAchievement(User user)
        {
            int total_number = GetNumberOfCommentByUserName(user.UserName);

            IEnumerable<Achievement> achievement = _dbContext.Achievements.Where(e => e.type == "Comment");
            foreach (Achievement achi in achievement)
            {
                CommentAchievement(user, total_number, achi.AchieveID);
            }
        }
        public bool CommentAchievement(User user, int numberOfComment, int AchieveID)
        {
            UserAchievement achievement = GetUserAchievementsByAchieveID(AchieveID).FirstOrDefault(e => e.UserID == user.UserID);
            Achievement achi = GetAchievementByAchieveID(AchieveID);
            if (numberOfComment >= achi.Condition)
            {
                if (achievement == null)
                {
                    UserAchievement userAchievement = new()
                    {
                        AchieveID = achi.AchieveID,
                        UserID = user.UserID,
                        UserName = user.UserName,
                        AchieveName = achi.AchieveName,
                        AchieveDes = achi.AchieveDes,
                        AchievementRequirement = achi.type + " " + achi.Condition.ToString(),
                        AchieveDate = DateTime.Now
                    };
                    AddUserAchievement(userAchievement);
                }
                return true;
            }
            return false;
        }

        //FollowComment
        public FollowComment AddFollowComment(FollowComment comment)
        {
            EntityEntry<FollowComment> e = _dbContext.FollowComments.Add(comment);
            FollowComment c = e.Entity;
            _dbContext.SaveChanges();
            return c;
        }
        public IEnumerable<FollowComment> GetFollowCommentByCommentID(int commentID)
        {
            IEnumerable<FollowComment> comments = _dbContext.FollowComments.Where(e => e.CommentID == commentID);
            return comments;
        }

        public IEnumerable<Comment> GetLikedComments(int userId)
        {
            IEnumerable<FollowComment> followComments = _dbContext.FollowComments.Where(e => (e.IsLiked == true && e.UserID == userId));
            IEnumerable<Comment> comments = new Comment[0]; 
            foreach (FollowComment fc in followComments)
            {
                Comment c = _dbContext.Comments.FirstOrDefault(e => e.CommentID == fc.CommentID);
                comments = comments.Append(c);
            }
            return comments;
        }

        public bool IsLiked(int userId, int commentId)
        {
            IEnumerable<Comment> comments = GetLikedComments(userId);
            Comment c = comments.FirstOrDefault(e => e.CommentID == commentId);
            if (c == null)
            {
                return false;
            }
            return true;
        }

        public FollowComment DisLikeComment(int userId, int commentId)
        {
            FollowComment c = _dbContext.FollowComments.FirstOrDefault(e => e.CommentID == commentId && e.UserID == userId && e.IsLiked == true);
            EntityEntry <FollowComment> e = _dbContext.FollowComments.Remove(c);
            FollowComment deleteC = e.Entity;
            _dbContext.SaveChanges();
            return deleteC;
        }


        //Question
        public IEnumerable<QuestionOutDto> GetQuesByUserName(string userName)
        {
            User user = GetUserByName(userName);
            IEnumerable<Question> Questions = _dbContext.Questions.Where(e => e.UserID == user.UserID).OrderByDescending(e => e.PostDate);

            IEnumerable<QuestionOutDto> QuestionsOut = Questions.Select(e =>
                                            new QuestionOutDto()
                                            {
                                                UserName = userName,
                                                QuestionTitle = e.QuestionTitle,
                                                Description = e.Description,
                                                TestCase = e.TestCase,
                                                Tags = e.Tags,
                                                RunMethod = e.RunMethod,
                                                SampleSolution = e.SampleSolution,
                                                PostDate = e.PostDate,
                                                QuestionID = e.QuestionID,
                                                Difficulty_level = e.Difficulty_level
                                            });
            return QuestionsOut;
        }

        public IEnumerable<QuestionOutDto> GetQuesByName(string name)
        {
            IEnumerable<Question> question = _dbContext.Questions.Where(e => e.QuestionTitle.ToLower().Contains(name.ToLower()) || e.SampleSolution.ToLower().Contains(name.ToLower()));

            IEnumerable<QuestionOutDto> QuestionsOut = question.Select(e =>
                                           new QuestionOutDto()
                                           {
                                               UserName = GetUser(e.UserID).UserName,
                                               QuestionTitle = e.QuestionTitle,
                                               Description = e.Description,
                                               RunMethod = e.RunMethod,
                                               TestCase = e.TestCase,
                                               Tags = e.Tags,
                                               SampleSolution = e.SampleSolution,
                                               PostDate = e.PostDate,
                                               QuestionID = e.QuestionID,
                                               Difficulty_level = e.Difficulty_level
                                           });
            return QuestionsOut;
        }

        public IEnumerable<QuestionOutDto> GetAllQuestions()
        {

            IEnumerable<Question> Questions = _dbContext.Questions.OrderByDescending(e => e.PostDate).ToList();

            IEnumerable<QuestionOutDto> QuestionsOut = Questions.Select(e =>
                                           new QuestionOutDto()
                                           {
                                               UserName = GetUser(e.UserID).UserName,
                                               QuestionTitle = e.QuestionTitle,
                                               Description = e.Description,
                                               RunMethod = e.RunMethod,
                                               TestCase = e.TestCase,
                                               Tags = e.Tags,
                                               SampleSolution = e.SampleSolution,
                                               PostDate = e.PostDate,
                                               QuestionID = e.QuestionID,
                                               Difficulty_level = e.Difficulty_level
                                           });
            return QuestionsOut;
        }

        public QuestionOutDto GetQuesByQuesID(int QuesID)
        {
            Question question = _dbContext.Questions.FirstOrDefault(e => e.QuestionID == QuesID);

            if (question == null)
            {
                return null;
            }
            else
            {
                QuestionOutDto questionOut = new()
                {
                    UserName = GetUser(question.UserID).UserName,
                    QuestionTitle = question.QuestionTitle,
                    Description = question.Description,
                    RunMethod = question.RunMethod,
                    TestCase = question.TestCase,
                    Tags = question.Tags,
                    SampleSolution = question.SampleSolution,
                    PostDate = question.PostDate,
                    QuestionID = question.QuestionID,
                    Difficulty_level = question.Difficulty_level
                };
                return questionOut;
            }
        }

        public Question AddQuestion(QuestioInputDto QuestionIn, string userName)
        {
            User user = GetUserByName(userName);

            Question question = new()
            {
                UserID = user.UserID,

                QuestionTitle = QuestionIn.QuestionTitle,
                PostDate = DateTime.Now,

                Description = QuestionIn.Description,
                TestCase = QuestionIn.TestCase,

                Tags = QuestionIn.Tags,
                RunMethod = QuestionIn.RunMethod,

                SampleSolution = QuestionIn.SampleSolution,

                Difficulty_level = QuestionIn.Difficulty_level
            };
            question = _dbContext.Questions.Add(question).Entity;

            _dbContext.SaveChanges();

            UpdateAllQuestionAchievement(user);

            return question;
        }

        public int GetNumberOfQuesByUserName(string userName)
        {
            return GetQuesByUserName(userName).Count();
        }

        public void UpdateAllQuestionAchievement(User user)
        {
            int total_number = GetNumberOfQuesByUserName(user.UserName);

            IEnumerable<Achievement> achievement = _dbContext.Achievements.Where(e => e.type == "Post");
            foreach (Achievement achi in achievement)
            {
                QuestionAchievement(user, total_number, achi.AchieveID);
            }
        }

        public bool QuestionAchievement(User user, int numberOfQues, int AchieveID)
        {
            UserAchievement achievement = GetUserAchievementsByAchieveID(AchieveID).FirstOrDefault(e => e.UserID == user.UserID);
            Achievement achi = GetAchievementByAchieveID(AchieveID);
            if (numberOfQues >= achi.Condition)
            {
                if (achievement == null)
                {
                    UserAchievement userAchievement = new()
                    {
                        AchieveID = achi.AchieveID,
                        UserID = user.UserID,
                        UserName = user.UserName,
                        AchieveName = achi.AchieveName,
                        AchieveDes = achi.AchieveDes,
                        AchievementRequirement = achi.type + " " + achi.Condition.ToString(),
                        AchieveDate = DateTime.Now
                    };
                    AddUserAchievement(userAchievement);
                }
                return true;
            }
            return false;
        }


        //Solution
        public IEnumerable<SolutionOutDto> GetSolusByUserName(string userName)
        {
            User user = GetUserByName(userName);
            IEnumerable<Solution> solutions = _dbContext.Solutions.Where(e => e.UserID == user.UserID).OrderByDescending(e => e.SubmitDate);
            IEnumerable<SolutionOutDto> solutionOuts = solutions.Select(e =>
            new SolutionOutDto()
            {
                QuestionID = e.QuestionID,
                QuestionTitle = e.QuestionTitle,
                userName = user.UserName,
                SolutionID = e.SolutionID,
                Status = e.Status,
                SubmitDate = e.SubmitDate,
                SolutionContext = e.SolutionContext,
                Tags = e.Tags
            });
            return solutionOuts;
        }

        public IEnumerable<SolutionOutDto> GetSolusByQuestionID(int QuestionID)
        {
            IEnumerable<Solution> solutions = _dbContext.Solutions.Where(e => e.QuestionID == QuestionID).OrderByDescending(e => e.SubmitDate);
            IEnumerable<SolutionOutDto> solutionOuts = solutions.Select(e =>
            new SolutionOutDto()
            {
                QuestionID = e.QuestionID,
                QuestionTitle = e.QuestionTitle,
                userName = GetUser(e.UserID).UserName,
                SolutionID = e.SolutionID,
                Status = e.Status,
                SubmitDate = e.SubmitDate,
                SolutionContext = e.SolutionContext,
                Tags = e.Tags
            });
            return solutionOuts;
        }

        public Solution AddSolution(SolutionInputDto SolutionIn, string userName)
        {
            if (GetQuesByQuesID(SolutionIn.QuestionID) == null)
            {
                return null;
            }

            QuestionOutDto question = GetQuesByQuesID(SolutionIn.QuestionID);
            User user = GetUserByName(userName);
            Solution solution = new()
            {
                UserID = user.UserID,
                QuestionID = SolutionIn.QuestionID,

                Status = SolutionIn.Status,
                SubmitDate = DateTime.Now,
                SolutionContext = SolutionIn.SolutionContext,
                Tags = SolutionIn.Tags,
                QuestionTitle = question.QuestionTitle,
            };

            solution = _dbContext.Solutions.Add(solution).Entity;
            _dbContext.SaveChanges();
            UpdateAllSolusAchievement(user);
            return solution;
        }

        public int GetNumberOfSolusByUserName(string userName)
        {
            IEnumerable<SolutionOutDto> solus = GetSolusByUserName(userName);

            ArrayList count = new();

            foreach (SolutionOutDto solu in solus)
            {
                Console.WriteLine(solu.QuestionID);
                if (!count.Contains(solu.QuestionID) && solu.Status == true)
                {
                    count.Add(solu.QuestionID);
                }
            }
            Console.WriteLine(count.ToString());
            Console.WriteLine(count.Count);
            return count.Count;
        }

        public void UpdateAllSolusAchievement(User user)
        {
            int total_number = GetNumberOfSolusByUserName(user.UserName);

            IEnumerable<Achievement> achievement = _dbContext.Achievements.Where(e => e.type == "Answer");
            foreach (Achievement achi in achievement)
            {
                SoluAchievement(user, total_number, achi.AchieveID);
            }
        }

        public bool SoluAchievement(User user, int numberOfSolus, int AchieveID)
        {
            UserAchievement achievement = GetUserAchievementsByAchieveID(AchieveID).FirstOrDefault(e => e.UserID == user.UserID);
            Achievement achi = GetAchievementByAchieveID(AchieveID);
            if (numberOfSolus >= achi.Condition)
            {
                if (achievement == null)
                {
                    UserAchievement userAchievement = new UserAchievement()
                    {
                        AchieveID = achi.AchieveID,
                        UserID = user.UserID,
                        UserName = user.UserName,
                        AchieveName = achi.AchieveName,
                        AchieveDes = achi.AchieveDes,
                        AchievementRequirement = achi.type + " " + achi.Condition.ToString(),
                        AchieveDate = DateTime.Now
                    };
                    AddUserAchievement(userAchievement);
                }
                return true;
            }
            return false;
        }


        //UserAchievement
        public IEnumerable<UserAchievement> GetAllUserAchievements()
        {
            return _dbContext.UserAchievements.ToList();
        }

        public UserAchievement GetUserAchievementById(int Id)
        {
            return _dbContext.UserAchievements.FirstOrDefault(e => e.AchievementId == Id);
        }

        public IEnumerable<UserAchievement> GetUserAchievementsByUserId(int UserId)
        {
            IEnumerable<UserAchievement> userAchievements = _dbContext.UserAchievements.Where(e => e.UserID == UserId);
            return userAchievements;
        }

        public IEnumerable<UserAchievement> GetUserAchievementsByUserName(string userName)
        {
            IEnumerable<UserAchievement> userAchievements = _dbContext.UserAchievements.Where(e => e.UserName == userName);
            return userAchievements;

        }

        public IEnumerable<UserAchievement> GetUserAchievementsByAchieveID(int AchieveId)
        {
            return _dbContext.UserAchievements.Where(e => e.AchieveID == AchieveId);
        }

        public IEnumerable<UserAchievement> GetUserAchievementByAchieveName(string AchievementName)
        {
            return _dbContext.UserAchievements.Where(e => e.AchieveName.ToLower().Contains(AchievementName.ToLower()));
        }

        public IEnumerable<UserAchievement> GetUserAchievementsByAchieveDate(DateTime date)
        {
            return _dbContext.UserAchievements.Where(e => e.AchieveDate == date);
        }

        public UserAchievement AddUserAchievement(UserAchievement userAchievement)
        {
            UserAchievement achievement = GetUserAchievementsByUserId(userAchievement.UserID).FirstOrDefault(e => e.AchieveName == userAchievement.AchieveName);

            if (achievement == null)
            {
                achievement = _dbContext.UserAchievements.Add(userAchievement).Entity;
                _dbContext.SaveChanges();
            }
            return achievement;
        }



        //Achievement
        public IEnumerable<Achievement> GetAchievementsByAchieveName(string name)
        {
            return _dbContext.Achievements.Where(e => e.AchieveName.ToLower().Contains(name.ToLower()));
        }

        public Achievement GetAchievementByAchieveID(int achieveID)
        {
            return _dbContext.Achievements.FirstOrDefault(e => e.AchieveID == achieveID);
        }

        public Achievement AddAchievement(Achievement achievement)
        {
            Achievement achievement1 = _dbContext.Achievements.Add(achievement).Entity;
            _dbContext.SaveChanges();
            return achievement1;
        }


        //Tags
        public IEnumerable<Tag> GetTags()
        {
            return _dbContext.Tags.ToList<Tag>();
        }

    }
}

