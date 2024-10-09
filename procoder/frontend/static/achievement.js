var tempPhoto = 1;

function loginHome(){
    if (localStorage.getItem("username") != null && localStorage.getItem("username") != ""){
        document.getElementById('nav_without_login').style.display = 'none';
        document.getElementById('nav_with_login').style.display = 'block';
        const url = 'http://192.168.31.77:5050/user/GetUser/';
        fetch(url+localStorage.getItem("username"))
            .then((response) => response.json())
            .then((data) => {
                document.getElementById('userPhoto').innerHTML = '<img src="Photo/' + data.userPhoto + '.png" alt="UserName" class="rounded-circle img-responsive" width="25" height="25">';
                document.getElementById('LoginUsername').innerHTML = localStorage.getItem('username');
                document.getElementById('photo').innerHTML = '<img src="Photo/' + data.userPhoto + '.png" alt="UserName" class="rounded-circle" width="200" height="200">';
                document.getElementById('userInfo').innerHTML = '<p class="mt-2">'+ data.description + '</p>';
                document.getElementById('description').innerText = data.description;
                tempPhoto = data.userPhoto;
            });
    }
}

function ChangePhoto(){
    const userId = localStorage.getItem("userId")
    const url = "http://192.168.31.77:5050/user/ChangePhoto/" + userId + "/" + tempPhoto;
    fetch(url, {
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            var newPhoto = data.profile_Photo;
            loginHome();
            document.getElementById('changeSuccess').setAttribute("class", 'toast fade show');
            document.getElementById('changeSuccess').hidden = false;
            $("#changeSuccess").show().delay(3000).fadeOut();
        });
}

function ChangeDescription(){
    const userId = localStorage.getItem("userId");
    const newDescription = document.getElementById('description').value;
    const url = "http://192.168.31.77:5050/user/ChangeDescription";
    const userUrl = "http://192.168.31.77:5050/user/GetUser/" + localStorage.getItem("username");
    if (newDescription == null || newDescription == ""){
        document.getElementById('emptyComment').setAttribute("class", 'toast fade show');
        document.getElementById('emptyComment').hidden = false;
        $("#emptyComment").show().delay(2000).fadeOut();
        return;
    }
    fetch(userUrl)
        .then(res => res.json())
        .then(data => {
            var data = {
                "userName": localStorage.getItem("username"),
                "email": data.email,
                "password": localStorage.getItem("password"),
                "description": newDescription
            };
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers:{
                    'Content-Type' : 'application/json',
                }
            })
                .then(res => res.json())
                .then(data => {
                    document.getElementById('userInfo').innerHTML = newDescription;
                    document.getElementById('changeDescriptionSuccess').setAttribute("class", 'toast fade show');
                    document.getElementById('changeDescriptionSuccess').hidden = false;
                    loginHome();
                    $("#changeDescriptionSuccess").show().delay(3000).fadeOut();
                });
        })
}

function GetUserAchievementName() {
    let username = localStorage.getItem("username")
    const ua = fetch("http://192.168.31.77:5050/userAchievement/GetUserAchievementsByUserName/"+username, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    });
    const streamPromise = ua.then((res)=>res.json())
    streamPromise.then(output => {
        const FirstUserAchievement = document.getElementById('UserAchievement');
        let achievementName = [];
        let achievement = [];
        let achievementDate =[];
        var achievementHtml = "<div class='row'>";

        for (let x = 0; x < output.length; x++) {
            achievement.push(output[x].achieveDes);
            achievementDate.push(output[x].achieveDate.toString().split('T')[0]);
            achievementName.push(output[x].achieveName);
        }

        if(achievement[0]!= undefined){
            for(let x =0;x<achievement.length;x++){
                achievementHtml += '<div class="col-4" style="text-align:center!important"><img class="bi me-2" width="80" height="80" src="badges/'+ achievementName[x] +'.png"><p>'+ achievement[x] +'</p>' +
                    '<p>'+ achievementDate[x] +'</p></div>';
            }
            achievementHtml += '</div>';
            document.getElementById("UserAchievement").innerHTML = achievementHtml;
        }
        else{
            const UserAchievement = document.createElement('p')
            UserAchievement.setAttribute('style','text-align:center!important')
            UserAchievement.innerHTML = "No achievement found, Please try Harder!"
            FirstUserAchievement.appendChild(UserAchievement)
        }

    })
}

function GetUserInfo() {
    let username = localStorage.getItem("username")

    const ui = fetch('http://192.168.31.77:5050/user/GetUser/'+username,{
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    });

    const streamPromise = ui.then((res) => res.json())
    streamPromise.then(output => {
        document.getElementById("Username").innerHTML = output.userName;
        document.getElementById("UserEmail").innerHTML = output.email;
        document.getElementById("point").innerHTML = "Total Points: " + output.point;
    })
}

function GetUserAnsweredQuestion() {
    let username = localStorage.getItem("username")
    const uai = fetch('http://192.168.31.77:5050/solution/GetSolusByUserName/' + username, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    });
    const streamPromise = uai.then((res) => res.json())
    let QuestionTitle = [];
    let AnswerStatus = [];

    streamPromise.then(output => {

        const FirstSubmission = document.getElementById('AnsweredQuestion');

        for (let x = 0; x < Math.min(output.length,5); x++) {
            QuestionTitle.push(output[x].questionTitle);
            AnswerStatus.push(output[x].status);
        }

        if(QuestionTitle[0]!=undefined){
            for(x=0;x<QuestionTitle.length;x++){
                const UserSubmissionName = document.createElement('a');
                UserSubmissionName.setAttribute('style','font-size: .77rem')
                UserSubmissionName.setAttribute('style',"text-decoration:none")
                UserSubmissionName.setAttribute('class','link-primary')
                UserSubmissionName.setAttribute("href","question.html?questionID="+output[x].questionID)
                UserSubmissionName.innerHTML = QuestionTitle[x] + ":"
                FirstSubmission.appendChild(UserSubmissionName);
                const UserSubmissionStatus = document.createElement('p');
                UserSubmissionStatus.setAttribute('style','font-size: .70rem')
                if(AnswerStatus[x]==false){
                    UserSubmissionStatus.innerHTML = 'Failed test case(s)!'
                    UserSubmissionStatus.style.color = 'red'

                }
                if(AnswerStatus[x]==true){
                    UserSubmissionStatus.innerHTML = 'Passed all test case(s)!'
                    UserSubmissionStatus.style.color = 'green'

                }
                FirstSubmission.append(UserSubmissionStatus);
            }
        }
        else{
            const UserSubmissionName = document.createElement('p');
            UserSubmissionName.setAttribute('style','font-size: .100rem')
            UserSubmissionName.innerHTML = "Oops, NO recent submissions"
            FirstSubmission.appendChild(UserSubmissionName);
        }
    })


}

GetUserInfo();
GetUserAchievementName();
GetUserAnsweredQuestion();

