function close_sign_in(){
    document.getElementById("signin").style.display = "none";
    document.getElementById("signup").style.display = "block";

}

function close_sign_up(){
    document.getElementById("signin").style.display = "block";
    document.getElementById("signup").style.display = "none";
}

function signUp(){
    document.getElementById("confirmHelp").innerText = "";
    document.getElementById("UsernameHelp").innerText = "";
    document.getElementById("EmailHelp").innerHTML = "";
    document.getElementById("passwordHelp").style.color = "";

    const UserName = document.getElementById("username_input").value;
    const email = document.getElementById("email_input").value;
    const UserPassword1 = document.getElementById("passwordInput1").value;
    const UserPassword2 = document.getElementById("passwordInput2").value;
    if (UserName == "" || UserPassword1 == "" ||  UserPassword1 == "") {
        document.getElementById("confirmHelp").innerHTML = `<p style="color: red">Please fill your username and password!`;
    }
    else if (UserPassword1 != UserPassword2){
        document.getElementById("confirmHelp").innerHTML = `<p style="color: red">Make sure you entered two same passwords!`;
    } else {
        const user = {'userName': UserName, 'email': email, 'password': UserPassword1, "description": ""};
        //const user = {'userName': "123231", 'email': "test1@gmail.com", 'password': "test123", "description": ""};

        fetch("http://192.168.31.77:5050/user/NewUser", {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(user)
        }).then((response) => {
            if (response.status == "401" || response.status == "400") {
                response.text().then((data) => {
                    if(UserPassword1.length < 6 || UserPassword1.length > 12){
                        document.getElementById("passwordHelp").style.color = "red";
                    }else{
                        document.getElementById("EmailHelp").innerHTML = `<p style="color: red">Please enter a valid Email.`;
                    }
                });
            } else {
                response.text().then((data) => {
                    alert("You have successfully registered!");
                    document.getElementById("signup").style.display = "none";
                    document.getElementById("username_input").value = "";
                    document.getElementById("email_input").value = "";
                    document.getElementById("passwordInput1").value = "";
                    document.getElementById("passwordInput2").value = "";

                    document.getElementById("signin").style.display = "block";
                    document.getElementById("SignInUsername_input").value = UserName;
                });
            }
        });
    }

}

function homelogin(){
    if (localStorage.getItem("username") != null && localStorage.getItem("password") != null){
        const url = 'http://192.168.31.77:5050/user/GetUser/';
        fetch(url+localStorage.getItem("username"))
            .then((response) => response.json())
            .then((data) => {
                localStorage.setItem("userId",data.userID);
                document.getElementById('userPhoto').innerHTML = '<img src="Photo/' + data.userPhoto + '.png" alt="UserName" class="rounded-circle" width="25" height="25">';
                document.getElementById('postUser').innerHTML = '<img src="Photo/'+ data.userPhoto +'.png" alt="avatar" class="rounded-circle img-fluid img-responsive" width="40">' +
                    '<input type="text" class="form-control mr-3 ms-1" placeholder="Leave a comment here..." id="generalComment">' +
                    '<button class="btn btn-primary ms-1" type="button" data-toggle="modal" data-target="#generalCommentTags">Post</button>';
            });
    }
}

function signIn() {
    document.getElementById("LoginHelp").innerHTML = ``;
    let username = document.getElementById("SignInUsername_input").value;
    let password = document.getElementById("SignInPassword_input").value;
    localStorage.setItem("username",username);
    localStorage.setItem("password",password);


    if (username == "" || password == ""){
        document.getElementById("LoginHelp").innerHTML = `<p style="color: red">Please enter your username and password!`;
    } else {
        encode = btoa(`${username}:${password}`);
        const fetchPromise = fetch("http://192.168.31.77:5050/api/GetVersionA", {headers: {"Authorization": "Basic " + encode,}});
        fetchPromise.then((response) => {
            if (response.status !== 200) {
                throw new Error(response.status)
            } else {
                response.text().then((data) => {
                    alert(`Hello ${username}, Welcome to our website of ${data} version`);
                    document.getElementById("nav_without_login").style.display = "none";
                    document.getElementById("nav_with_login").style.display = "block";
                    document.getElementById('LoginUsername').innerHTML = localStorage.getItem('username');
                    homelogin();
                })
            }
        })
            .catch(function (error) {
                document.getElementById("LoginHelp").innerHTML = `<p style="color: red">You have entered wrong username or password!`;
                encode = "";
            })
    }
}

function login(){
    if (localStorage.getItem("username") != null){
        if(localStorage.getItem("username") != ""){
            document.getElementById("nav_without_login").style.display = "none";
            document.getElementById("nav_with_login").style.display = "block";
            const url = 'http://192.168.31.77:5050/user/GetUser/';
            fetch(url+localStorage.getItem("username"))
                .then((response) => response.json())
                .then((data) => {
                    localStorage.setItem("userId",data.userID);
                    document.getElementById('userPhoto').innerHTML = '<img src="Photo/' + data.userPhoto + '.png" alt="UserName" class="rounded-circle" width="25" height="25">';
                    document.getElementById('LoginUsername').innerHTML = localStorage.getItem('username');
                    document.getElementById('postUser').innerHTML = '<img src="Photo/'+ data.userPhoto +'.png" alt="avatar" class="rounded-circle img-fluid img-responsive" width="40">' +
                        '<input type="text" class="form-control mr-3 ms-1" placeholder="Leave a comment here..." id="generalComment">' +
                        '<button class="btn btn-primary ms-1" type="button" data-toggle="modal" data-target="#generalCommentTags">Post</button>';
                });

        }


    }

}

var hours = 6; // to clear the localStorage after 1 hour
               // (if someone want to clear after 8hrs simply change hours=8)
var now = new Date().getTime();
var setupTime = localStorage.getItem('setupTime');
if (setupTime == null) {
    localStorage.setItem('setupTime', now)
} else {
    if(now-setupTime > hours*60*60*1000) {
        localStorage.clear()
        localStorage.setItem('setupTime', now);
    }
}
function openDiscussion(){
    var classDIV = document.getElementById("leftBar");
    if(document.getElementById("leftBar").classList.contains("open")){
        document.getElementById("userComments").className = "d-flex justify-content-center";
        classDIV.className= "col-1 close";
        document.getElementById("userComments").setAttribute("class", "col-10 d-flex justify-content-center");
        document.getElementById("leftBar").setAttribute("class", "col-1 close");
    }else{
        document.getElementById("userComments").className = "col-8";
        classDIV.className= "col-sm-4 open";
        document.getElementById("userComments").setAttribute("class", "col-8");
        document.getElementById("leftBar").setAttribute("class", "col-sm-4 open");
    }
}

function switchTimeButton(){
    if (document.getElementById("switchTimeButton").classList.contains("fromTop")){
        var fromBottom = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-sort-down-alt' viewBox='0 0 16 16'><path d='M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293V3.5zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z'></path></svg>";
        document.getElementById("switchTime").innerHTML = fromBottom;

        document.getElementById("switchTimeButton").className = "btn btn-outline-secondary fromBottom";
        document.getElementById("switchTimeButton").setAttribute("class", "btn btn-outline-secondary fromBottom");
    }else{
        var fromTop = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-sort-up' viewBox='0 0 16 16'><path d='M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z'></path></svg>";
        document.getElementById("switchTime").innerHTML = fromTop;

        document.getElementById("switchTimeButton").className = "btn btn-outline-secondary fromTop";
        document.getElementById("switchTimeButton").setAttribute("class", "btn btn-outline-secondary fromTop");
    }
}

function switchLikeButton(){
    if (document.getElementById("switchLikeButton").classList.contains("fromTop")){
        var fromBottom = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-sort-down-alt' viewBox='0 0 16 16'><path d='M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293V3.5zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z'></path></svg>";
        document.getElementById("switchLike").innerHTML = fromBottom;

        document.getElementById("switchLikeButton").className = "btn btn-outline-secondary fromBottom";
        document.getElementById("switchLikeButton").setAttribute("class", "btn btn-outline-secondary fromBottom");
    }else{
        var fromTop = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-sort-up' viewBox='0 0 16 16'><path d='M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z'></path></svg>";
        document.getElementById("switchLike").innerHTML = fromTop;

        document.getElementById("switchLikeButton").className = "btn btn-outline-secondary fromTop";
        document.getElementById("switchLikeButton").setAttribute("class", "btn btn-outline-secondary fromTop");
    }
}

function sortTableByLikes(){
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("commentTable");
    switching = true;
    if (document.getElementById("switchLikeButton").classList.contains("fromBottom")){
        // Make a loop that will continue until no switching has been done:
        while (switching) {
            //start by saying: no switching is done:
            switching = false;
            rows = table.rows;
            //Loop through all table rows (except the first, which contains table headers):
            for (i = 1; i < (rows.length - 1); i+=1) {
                //start by saying there should be no switching:
                shouldSwitch = false;
                //Get the two elements you want to compare, one from current row and one from the next:
                x = rows[i].getElementsByTagName("td")[2];
                y = rows[i + 1].getElementsByTagName("td")[2];
                //check if the two rows should switch place:
                if (Number(x.innerHTML) > Number(y.innerHTML)) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                //If a switch has been marked, make the switch and mark that a switch has been done:*/
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                rows[i+1].parentNode.insertBefore(rows[i + 1], rows[i+1]);
                switching = true;
            }
        }
    }else{
        // Make a loop that will continue until no switching has been done:
        while (switching) {
            //start by saying: no switching is done:
            switching = false;
            rows = table.rows;
            //Loop through all table rows (except the first, which contains table headers):
            for (i = 1; i < (rows.length - 1); i++) {
                //start by saying there should be no switching:
                shouldSwitch = false;
                //Get the two elements you want to compare, one from current row and one from the next:
                x = rows[i].getElementsByTagName("td")[2];
                y = rows[i + 1].getElementsByTagName("td")[2];
                //check if the two rows should switch place:
                if (Number(x.innerHTML) < Number(y.innerHTML)) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                //If a switch has been marked, make the switch and mark that a switch has been done:*/
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    }
}

function sortTableByTime(){
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("commentTable");
    switching = true;
    if (document.getElementById("switchTimeButton").classList.contains("fromBottom")){
        // Make a loop that will continue until no switching has been done:
        while (switching) {
            //start by saying: no switching is done:
            switching = false;
            rows = table.rows;
            //Loop through all table rows (except the first, which contains table headers):
            for (i = 1; i < (rows.length - 1); i+=1) {
                //start by saying there should be no switching:
                shouldSwitch = false;
                //Get the two elements you want to compare, one from current row and one from the next:
                x = rows[i].getElementsByTagName("td")[3];
                y = rows[i + 1].getElementsByTagName("td")[3];
                //check if the two rows should switch place:
                if (x.innerHTML > y.innerHTML) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                //If a switch has been marked, make the switch and mark that a switch has been done:*/
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                rows[i+1].parentNode.insertBefore(rows[i + 1], rows[i+1]);
                switching = true;
            }
        }
    }else{
        // Make a loop that will continue until no switching has been done:
        while (switching) {
            //start by saying: no switching is done:
            switching = false;
            rows = table.rows;
            //Loop through all table rows (except the first, which contains table headers):
            for (i = 1; i < (rows.length - 1); i++) {
                //start by saying there should be no switching:
                shouldSwitch = false;
                //Get the two elements you want to compare, one from current row and one from the next:
                x = rows[i].getElementsByTagName("td")[3];
                y = rows[i + 1].getElementsByTagName("td")[3];
                //check if the two rows should switch place:
                if (x.innerHTML < y.innerHTML) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                //If a switch has been marked, make the switch and mark that a switch has been done:*/
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    }
}

function pressTag(tagName){
    var colors_dict = {'Easy':'success', 'Medium':'warning', 'Hard':'danger', 'Python':'primary', 'Java':'secondary', 'C':'success', 'Algorithm':'warning', 'Array':'danger', 'Sorting':'info', 'Math':'primary', 'Counting':'secondary', 'Tree':'success', 'General':'secondary'};
    // if active: class="active" (delete), aria-pressed="false"
    if (document.getElementById(tagName).classList.contains("active")){
        document.getElementById(tagName).classList = "btn-check";
        document.getElementById(tagName).setAttribute("class", "btn-check");

        var string = document.getElementById("tagResult").innerHTML;
        var htmlString = "";
        var elements = string.split("</span>");
        for (var i = 0; i < (elements.length - 1); i++){
            if (! elements[i].includes(tagName)){
                htmlString += elements[i] + ' </span>';
            }
        }
        document.getElementById("tagResult").innerHTML = htmlString;
    }else{
        // if unactive: class="active", aria-pressed="true"; <div id="tagResult"><span class="badge rounded-pill bg-primary">Python</span></div>
        // <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        document.getElementById(tagName).classList = "btn-check active";
        document.getElementById(tagName).setAttribute("class", "btn-check active");

        color = colors_dict[tagName];
        document.getElementById("tagResult").innerHTML += "<span class='badge rounded-pill bg-" +color + " me-1'>" + tagName + " </span>";
    }
}

function getRanking(){
    var rankingUrl = 'http://192.168.31.77:5050/user/GetRanking'
    fetch(rankingUrl)
        .then(response => response.json())
        .then(data => {
            var rankingHtml = "";
            var count = 0;
            for (var i = 0; count < Math.min(10, data.length-1); i++){
                if(data[i].userName != "generalComment" && data[i].point != 0){
                    if (i == 0) {
                        rankingHtml += '<tr class="align-middle"><th scope="row" class="Pro justify-content-center" style="height: auto"><img class="leaderBadge" src="badges/leaderBadge1.png" width="150" height="150"></th>' +
                            '<td class="Pro"><div class="row justify-content-center"><div class="col"><img class="leaderAvatar" src="Photo/' + data[i].profile_Photo + '.png" width="150" height="150"></div></div><div class="row justify-content-center"><div class="col" style="line-height: 50px">' +
                            data[i].userName + '</div></div></td><td><span class="Code">' + data[i].point + '</span></td></tr>';
                    } else if (i == 1) {
                        rankingHtml += '<tr class="align-middle"><th scope="row" class="Pro justify-content-center" style="height: auto"><img class="leaderBadge" src="badges/leaderBadge2.png" width="120" height="120"></th>' +
                            '<td class="Pro"><div class="row justify-content-center"><div class="col"><img class="leaderAvatar" src="Photo/' + data[i].profile_Photo + '.png" width="120" height="120"></div></div><div class="row justify-content-center"><div class="col" style="line-height: 40px">' +
                            data[i].userName + '</div></div></td><td><span class="Code">' + data[i].point + '</span></td></tr>';
                    } else if (i == 2) {
                        rankingHtml += '<tr class="align-middle"><th scope="row" class="Pro justify-content-center" style="height: auto"><img class="leaderBadge" src="badges/leaderBadge3.png" width="100" height="100"></th>' +
                            '<td class="Pro"><div class="row justify-content-center"><div class="col"><img class="leaderAvatar" src="Photo/' + data[i].profile_Photo + '.png" width="100" height="100"></div></div><div class="row justify-content-center"><div class="col" style="line-height: 30px">' +
                            data[i].userName + '</div></div></td><td><span class="Code">' + data[i].point + '</span></td></tr>';
                    } else {
                        rankingHtml += '<tr class="align-middle"><th scope="row" class="Pro justify-content-center" style="line-height: 60px"><img class="leaderBadge" src="badges/leaderBadge4To10.png" width="60" height="60"></th>' +
                            '<td class="Pro"><div class="row justify-content-center"><div class="col"><img class="leaderAvatar" src="Photo/' + data[i].profile_Photo + '.png" width="60" height="60"></div></div><div class="row justify-content-center"><div class="col" style="line-height: 20px">' +
                            data[i].userName + '</div></div></td><td><span class="Code">' + data[i].point + '</span></td></tr>';
                    }
                    count += 1;
                }else{
                    count = 10;
                }
            }
            document.getElementById("leaderBoard").innerHTML = rankingHtml;
        });
}



(function() {
    var Util,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    Util = (function() {
        function Util() {}

        Util.prototype.extend = function(custom, defaults) {
            var key, value;
            for (key in custom) {
                value = custom[key];
                if (value != null) {
                    defaults[key] = value;
                }
            }
            return defaults;
        };

        Util.prototype.isMobile = function(agent) {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
        };

        return Util;

    })();

    this.WOW = (function() {
        WOW.prototype.defaults = {
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 0,
            mobile: true
        };

        function WOW(options) {
            if (options == null) {
                options = {};
            }
            this.scrollCallback = __bind(this.scrollCallback, this);
            this.scrollHandler = __bind(this.scrollHandler, this);
            this.start = __bind(this.start, this);
            this.scrolled = true;
            this.config = this.util().extend(options, this.defaults);
        }

        WOW.prototype.init = function() {
            var _ref;
            this.element = window.document.documentElement;
            if ((_ref = document.readyState) === "interactive" || _ref === "complete") {
                return this.start();
            } else {
                return document.addEventListener('DOMContentLoaded', this.start);
            }
        };

        WOW.prototype.start = function() {
            var box, _i, _len, _ref;
            this.boxes = this.element.getElementsByClassName(this.config.boxClass);
            if (this.boxes.length) {
                if (this.disabled()) {
                    return this.resetStyle();
                } else {
                    _ref = this.boxes;
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        box = _ref[_i];
                        this.applyStyle(box, true);
                    }
                    window.addEventListener('scroll', this.scrollHandler, false);
                    window.addEventListener('resize', this.scrollHandler, false);
                    return this.interval = setInterval(this.scrollCallback, 50);
                }
            }
        };

        WOW.prototype.stop = function() {
            window.removeEventListener('scroll', this.scrollHandler, false);
            window.removeEventListener('resize', this.scrollHandler, false);
            if (this.interval != null) {
                return clearInterval(this.interval);
            }
        };

        WOW.prototype.show = function(box) {
            this.applyStyle(box);
            return box.className = "" + box.className + " " + this.config.animateClass;
        };

        WOW.prototype.applyStyle = function(box, hidden) {
            var delay, duration, iteration;
            duration = box.getAttribute('data-wow-duration');
            delay = box.getAttribute('data-wow-delay');
            iteration = box.getAttribute('data-wow-iteration');
            return box.setAttribute('style', this.customStyle(hidden, duration, delay, iteration));
        };

        WOW.prototype.resetStyle = function() {
            var box, _i, _len, _ref, _results;
            _ref = this.boxes;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                box = _ref[_i];
                _results.push(box.setAttribute('style', 'visibility: visible;'));
            }
            return _results;
        };

        WOW.prototype.customStyle = function(hidden, duration, delay, iteration) {
            var style;
            style = hidden ? "visibility: hidden; -webkit-animation-name: none; -moz-animation-name: none; animation-name: none;" : "visibility: visible;";
            if (duration) {
                style += "-webkit-animation-duration: " + duration + "; -moz-animation-duration: " + duration + "; animation-duration: " + duration + ";";
            }
            if (delay) {
                style += "-webkit-animation-delay: " + delay + "; -moz-animation-delay: " + delay + "; animation-delay: " + delay + ";";
            }
            if (iteration) {
                style += "-webkit-animation-iteration-count: " + iteration + "; -moz-animation-iteration-count: " + iteration + "; animation-iteration-count: " + iteration + ";";
            }
            return style;
        };

        WOW.prototype.scrollHandler = function() {
            return this.scrolled = true;
        };

        WOW.prototype.scrollCallback = function() {
            var box;
            if (this.scrolled) {
                this.scrolled = false;
                this.boxes = (function() {
                    var _i, _len, _ref, _results;
                    _ref = this.boxes;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        box = _ref[_i];
                        if (!(box)) {
                            continue;
                        }
                        if (this.isVisible(box)) {
                            this.show(box);
                            continue;
                        }
                        _results.push(box);
                    }
                    return _results;
                }).call(this);
                if (!this.boxes.length) {
                    return this.stop();
                }
            }
        };

        WOW.prototype.offsetTop = function(element) {
            var top;
            top = element.offsetTop;
            while (element = element.offsetParent) {
                top += element.offsetTop;
            }
            return top;
        };

        WOW.prototype.isVisible = function(box) {
            var bottom, offset, top, viewBottom, viewTop;
            offset = box.getAttribute('data-wow-offset') || this.config.offset;
            viewTop = window.pageYOffset;
            viewBottom = viewTop + this.element.clientHeight - offset;
            top = this.offsetTop(box);
            bottom = top + box.clientHeight;
            return top <= viewBottom && bottom >= viewTop;
        };

        WOW.prototype.util = function() {
            return this._util || (this._util = new Util());
        };

        WOW.prototype.disabled = function() {
            return !this.config.mobile && this.util().isMobile(navigator.userAgent);
        };

        return WOW;

    })();

}).call(this);


wow = new WOW(
    {
        animateClass: 'animated',
        offset: 100
    }
);
wow.init();
