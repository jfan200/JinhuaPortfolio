var colors_dict = {'Easy':'success', 'Medium':'warning', 'Hard':'danger', 'Python':'primary', 'Java':'secondary', 'C':'success', 'Algorithm':'warning', 'Array':'danger', 'Sorting':'info', 'Math':'primary', 'Counting':'secondary', 'Tree':'success', 'General':'secondary'};

function login(){
    if (localStorage.getItem("username") != null && localStorage.getItem("username") != ""){
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
function CheckLogin(){
    if((localStorage.getItem("username") == '' || localStorage.getItem("username") == null)){
        document.getElementById('collapseExample').className = 'collapse show';
        $("#collapseExample").attr("class", 'collapse show');
        return false;
    }
    return true;
}

function getAllComments(){
    const url = "http://192.168.31.77:5050/comment/GetAllComments";
    const questionUrl = "http://192.168.31.77:5050/question/GetQuesByQuesID/";
    const followUrl = "http://192.168.31.77:5050/comment/GetFollowComment/";

    const fetchPromise = fetch(url);
    const streamProise = fetchPromise.then((response) => response.json());

    streamProise.then((data) => {
        data.forEach(d => {
            // Comment Out DTO
            var content = d.commentText;
            var questionID = d.questionID;
            var postTime = d.createdDate.split('T')[0];
            var commentID = d.commentID;
            //var rating = d.commentRating;
            var tags = d.tags.split(',');
            var userId = d.userId;
            var userPhoto = d.photo;
            //var userName = d.userName;

            fetch(questionUrl+questionID)
                .then((response) => response.json())
                .then((data) => {
                    // Question Out DTO
                    var title = data.questionTitle;
                    var description = data.description;
                    var tagHtml = "";
                    tags.forEach(element => {
                        tagHtml += '<span class="badge rounded-pill bg-' + colors_dict[element] + ' me-1">' + element + ' </span>';
                    });
                    if(questionID == 0){
                        var modalHtml = '<div class="modal fade show" id="staticBackdrop' + commentID + '" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">' +
                            '<div class="modal-dialog modal-lg modal-dialog-centered">' +
                            '<div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="staticBackdropLabel">Discuss: <strong>' + title + '</strong></h5>' +
                            '<button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button></div>' +
                            '<div class="modal-body"><div class="container-fluid">' +
                            '<div class="comments"><div class="row"><div class="col-2"><div class="row d-flex justify-content-center"><img src="Photo/' + userPhoto + '.png" alt="avatar" class="rounded-circle img-fluid" style="width: 100px;">' +
                            '</div></div><div class="col-10 p-bg-blue"><p>' + content + '</p>' +
                            '<div class="row d-flex justify-content-end heart_container me-3 mb-3">';
                    }else{
                        var modalHtml = '<div class="modal fade show" id="staticBackdrop' + commentID + '" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">' +
                            '<div class="modal-dialog modal-lg modal-dialog-centered">' +
                            '<div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="staticBackdropLabel">Discuss: <strong>' + title + '</strong></h5>' +
                            '<button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button></div>' +
                            '<div class="modal-body"><div class="container-fluid"><div class="row sticky-top"><div class="card border-warning"><div class="card-body">' +
                            '<div class="collapse show" id="description'+ commentID +'"><h5 class="card-title"><strong>Question Title: </strong>' + title + '</h5><br>' +
                            '<p class="card-text"><strong>Question Description:</strong><p class="desContent">' + description +
                            '</p></div><div class="row"><div class="col-10"><a href="question.html?questionID='+ questionID +'" class="btn btn-outline-success mt-2">View Question</a></div><div class="col-2">' +
                            '<nav class="navbar navbar-light"><button class="btn btn-success" type="button" data-bs-toggle="collapse" data-bs-target="#description'+ commentID +'">' +
                            '<span class="navbar-toggler-icon"></span></button></nav></div></div></div></div></div><br>' +
                            '<div class="comments"><div class="row"><div class="col-2"><div class="row d-flex justify-content-center"><img src="Photo/' + userPhoto + '.png" alt="avatar" class="rounded-circle img-fluid" style="width: 80px;">' +
                            '</div></div><div class="col-10 p-bg-blue"><p>' + content + '</p>' +
                            '<div class="row d-flex justify-content-end heart_container me-3 mb-3">';
                    }

                    var likeButton = '<button class="like-button" onmousedown="clickLike('+ commentID +')"><div class="like-wrapper"><div class="ripple"></div><svg class="heart" width="24" height="24" viewBox="0 0 24 24">' +
                        '<path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>' +
                        '</svg><div class="particles" style="--total-particles: 6"><div class="particle" style="--i: 1; --color: #7642F0"></div>' +
                        '<div class="particle" style="--i: 2; --color: #AFD27F"></div><div class="particle" style="--i: 3; --color: #DE8F4F"></div>' +
                        '<div class="particle" style="--i: 4; --color: #D0516B"></div><div class="particle" style="--i: 5; --color: #5686F2"></div>' +
                        '<div class="particle" style="--i: 6; --color: #D53EF3"></div></div></div></button></div></div></div><br><div class="row">' +
                        '<h4>Followup Discussions:</h4><hr></div>';

                    var endModal = '</div></div></div><div class="modal-footer" style="height: 80px"><div class="container-fluid" id="CommentContent"><div class="row" style="height: 80px">' +
                        '<div class="col-10"><div class="input-group w-100"><button type="button" class="btn btn-success" id="postComment" onclick="postFollowComment('+ commentID +')">' +
                        'Post</button><input id="addComment'+ commentID +'" style="height: 60px" aria-describedby="basic-addon1" aria-label="Input group" class="form-control" placeholder="Compose a new followup discussion..." type="text">' +
                        '</div></div><div class="col-2 mt-2"><button type="button" class="btn btn-secondary" data-dismiss="modal" id="CloseComment">Close</button>' +
                        '</div></div></div></div></div></div></div>';



                    fetch(followUrl+commentID)
                        .then((response) => response.json())
                        .then((data) => {
                            // Follow Comment Out DTO
                            var followComment = [];
                            var followCommentUser = [];
                            var followCommentPhotos = [];
                            var likes = 0;
                            var userLikes = false;
                            var color = "#c0c0c0"
                            var className = "dislikeComment";
                            data.forEach(follow => {
                                if (follow.following != null && follow.following != ""){
                                    followComment.push(follow.following);
                                    followCommentUser.push(follow.userID);
                                    followCommentPhotos.push(follow.photo);
                                }else if (follow.isLiked == true){
                                    likes += 1;
                                    if (follow.userID == localStorage.getItem("userId")){
                                        userLikes = true;
                                        color = "#ea442b";
                                        className = "likeComment";
                                    }
                                }
                            });
                            modalHtml += '<span class="'+ className + ' mt-3" id="likeCount'+ commentID +'" style="width:auto; color:' + color + '">'+ likes +' Likes</span>' + likeButton;

                            if (followComment.length == 0){
                                modalHtml += '<div class="container-fluid" id="follow'+ commentID +'"><p>This comment doesn\'t have any follow up discussion.</p></div>';
                            }else{
                                modalHtml += '<div class="container-fluid" id="follow'+ commentID +'">';
                                for (let i = 0; i < followCommentUser.length; i++){
                                    modalHtml += '<div class="row"><div class="col-10 p-bg-green follow-up-discussions"><p>' + followComment[i] +'</p></div>' +
                                        '<div class="col"><img src="Photo/'+ followCommentPhotos[i] +'.png" alt="avatar" class="rounded-circle img-fluid" style="width: 70px;"></div></div><br>';
                                }
                                modalHtml += '</div>';
                            }
                            modalHtml += endModal;
                            if(commentID == 0){
                                document.getElementById('resultTable').innerHTML += '<tr class="bg-blue" data-toggle="modal" data-target="#staticBackdrop' + commentID + '"><td><strong>General: </strong>'
                                    + content + '</td>\t\n\t\n<td>' + tagHtml + '</td>\t\n\t\n<td id="commentLike'+ commentID +'">'+ likes + '</td><td>' + postTime + '</td></tr>' + modalHtml;
                            }else{
                                document.getElementById('resultTable').innerHTML += '<tr class="bg-blue" data-toggle="modal" data-target="#staticBackdrop' + commentID + '"><td><strong>' + title + ': </strong>'
                                    + content + '</td>\t\n\t\n<td>' + tagHtml + '</td>\t\n\t\n<td id="commentLike'+ commentID +'">'+ likes + '</td><td>' + postTime + '</td></tr>' + modalHtml;
                            }
                        })
                        .catch(function(e){
                            modalHtml += '<span class="dislikeComment mt-3" id = "likeCount'+ commentID + '" style="width:auto; color: #c0c0c0">0 Likes</span>' + likeButton +
                                '<div class="container-fluid" id = "follow' + commentID + '"><p>This comment doesn\'t have any follow up discussion.</p></div>' + endModal;
                            if (commentID == 0){
                                document.getElementById('resultTable').innerHTML += '<tr class="bg-blue" data-toggle="modal" data-target="#staticBackdrop' + commentID + '"><td><strong>General: </strong>'
                                    + content + '</td>\t\n\t\n<td>' + tagHtml + '</td>\t\n\t\n<td id="commentLike'+ commentID +'">0</td><td>' + postTime + '</td></tr>' + modalHtml;
                            }else{
                                document.getElementById('resultTable').innerHTML += '<tr class="bg-blue" data-toggle="modal" data-target="#staticBackdrop' + commentID + '"><td><strong>' + title + ': </strong>'
                                    + content + '</td>\t\n\t\n<td>' + tagHtml + '</td>\t\n\t\n<td id="commentLike'+ commentID +'">0</td><td>' + postTime + '</td></tr>' + modalHtml;
                            }
                        });
                });
        });
    });
}

function clickLike(commentId){
    const followUrl = "http://192.168.31.77:5050/comment/GetFollowComment/";
    const dislikeUrl = "http://192.168.31.77:5050/comment/DislikeComment/"+localStorage.getItem("userId") + "/" + commentId;
    const postFollowUrl = "http://192.168.31.77:5050/comment/NewFollowComment";

    fetch(followUrl + commentId)
        .then((response) => response.json())
        .then((data) => {
            // Follow Comment Out DTO
            var likes = 0;
            var userLikes = false;
            var color = "#ea442b"
            data.forEach(follow => {
                if (follow.following == null || follow.following == ""){
                    if (follow.isLiked == true){
                        likes += 1;
                        if (follow.userID == localStorage.getItem("userId")){
                            userLikes = true;
                            color = "#c0c0c0";
                        }
                    }
                }
            });
            if (userLikes){
                // user likes => dislikes
                fetch(dislikeUrl,{
                    method: 'DELETE',
                })
                    .then((response) => response.json())
                    .then((data) => data);
                likes = likes - 1;
                document.getElementById("likeCount"+commentId).style.color = color;
                document.getElementById("likeCount"+commentId).innerText = likes + " likes";
                document.getElementById("likeCount"+commentId).className = "dislikeComment mt-3";
                document.getElementById("commentLike"+commentId).innerText = likes;
                // show notice
                document.getElementById('dislikeSuccess').className = 'toast fade show';
                document.getElementById('dislikeSuccess').setAttribute("class", 'toast fade show');
                document.getElementById('dislikeSuccess').hidden = false;
                $("#dislikeSuccess").show().delay(1000).fadeOut();
            }else{
                //user dislikes => likes
                var data = {"commentID":commentId, "isLiked":true, "following":null};
                var base64encodedData = btoa(localStorage.getItem("username") + ":" + localStorage.getItem("password"));
                fetch(postFollowUrl, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers:{
                        'Content-Type' : 'application/json',
                        "Authorization": "Basic " + base64encodedData,
                    }
                })
                likes = likes + 1;
                document.getElementById("likeCount"+commentId).style.color = color;
                document.getElementById("likeCount"+commentId).innerText = likes + " likes";
                document.getElementById("likeCount"+commentId).className = "likeComment mt-3";
                document.getElementById("likeCount"+commentId).setAttribute("class", "likeComment mt-3");
                document.getElementById("commentLike"+commentId).innerText = likes;
            }
        })
        .catch(function(e){
            var data = {"commentID":commentId, "isLiked":true, "following":null};
            var base64encodedData = btoa(localStorage.getItem("username") + ":" + localStorage.getItem("password"));
            fetch(postFollowUrl, {
                method: 'POST',
                body: JSON.stringify(data),
                headers:{
                    'Content-Type' : 'application/json',
                    "Authorization": "Basic " + base64encodedData,
                }
            })
            document.getElementById("likeCount"+commentId).style.color = "#ea442b";
            document.getElementById("likeCount"+commentId).innerText = "1 likes";
            document.getElementById("likeCount"+commentId).className = "likeComment mt-3";
            document.getElementById("likeCount"+commentId).setAttribute("class", "likeComment mt-3");
            document.getElementById("commentLike"+commentId).innerText = 1;
        });
}

function postFollowComment(commentID){
    const followUrl = "http://192.168.31.77:5050/comment/GetFollowComment/";

    var followComment = document.getElementById("addComment" + commentID).value;
    var data = {"commentID":commentID, "isLiked":false, "following":followComment};
    var base64encodedData = btoa(localStorage.getItem("username") + ":" + localStorage.getItem("password"));

    if(followComment == "" || followComment == null){
        // show notice
        document.getElementById('emptyComment').className = 'toast fade show';
        document.getElementById('emptyComment').setAttribute("class", 'toast fade show');
        document.getElementById('emptyComment').hidden = false;
        $("#emptyComment").show().delay(3000).fadeOut();
        return;
    }

    if(localStorage.getItem('username') != null){


        const postFollowUrl = "http://192.168.31.77:5050/comment/NewFollowComment";
        fetch(postFollowUrl, {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type' : 'application/json',
                "Authorization": "Basic " + base64encodedData,
            }
        })
            .then(res => res.json())
            .then(response => {
                var id = "follow" + commentID;
                document.getElementById("addComment" + commentID).value = "";

                fetch(followUrl+commentID)
                    .then((response) => response.json())
                    .then((data) => {
                        // Follow Comment Out DTO
                        var followComment = [];
                        var followCommentUser = [];
                        var followCommentPhotos = [];
                        var followHtml = "";
                        data.forEach(follow => {
                            if (follow.following != null && follow.following != ""){
                                followComment.push(follow.following);
                                followCommentUser.push(follow.userID);
                                followCommentPhotos.push(follow.photo);
                            }
                        });
                        for (let i = 0; i < followCommentUser.length; i++){
                            followHtml += '<div class="row"><div class="col-10 p-bg-green follow-up-discussions"><p>' + followComment[i] +'</p></div>' +
                                '<div class="col"><img src="Photo/'+ followCommentPhotos[i] +'.png" alt="avatar" class="rounded-circle img-fluid" style="width: 70px;"></div></div><br>';
                        }
                        document.getElementById(id).innerHTML = followHtml;

                        // show notice
                        document.getElementById('postSuccess').className = 'toast fade show';
                        document.getElementById('postSuccess').setAttribute("class", 'toast fade show');
                        document.getElementById('postSuccess').hidden = false;
                        $("#postSuccess").show().delay(1000).fadeOut();
                    })
            });
    }
    else{
        document.getElementById('warningComment').className = 'toast fade show';
        document.getElementById('warningComment').setAttribute("class", 'toast fade show');
        document.getElementById('warningComment').hidden = false;
        $("#warningComment").show().delay(3000).fadeOut();
        return;
    }

}

function pressCommentTag(tagName){
    var colors_dict = {'Easy':'success', 'Medium':'warning', 'Hard':'danger', 'Python':'primary', 'Java':'secondary', 'C':'success', 'Algorithm':'warning', 'Array':'danger', 'Sorting':'info', 'Math':'primary', 'Counting':'secondary', 'Tree':'success', 'General':'secondary'};
    // if active: class="active" (delete), aria-pressed="false"
    if (document.getElementById(tagName+'Comment').classList.contains("active")){
        document.getElementById(tagName+'Comment').classList = "btn-check";
        document.getElementById(tagName+'Comment').setAttribute("class", "btn-check");

        var string = document.getElementById("commentTagResult").innerHTML;
        var htmlString = "";
        var elements = string.split("</span>,");
        for (var i = 0; i < (elements.length - 1); i++){
            if (! elements[i].includes(tagName)){
                htmlString += elements[i] + ' </span>,';
            }
        }
        document.getElementById("commentTagResult").innerHTML = htmlString;
    }else{
        // if unactive: class="active", aria-pressed="true"; <div id="tagResult"><span class="badge rounded-pill bg-primary">Python</span></div>
        // <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        document.getElementById(tagName+'Comment').classList = "btn-check active";
        document.getElementById(tagName+'Comment').setAttribute("class", "btn-check active");

        color = colors_dict[tagName];
        document.getElementById("commentTagResult").innerHTML += "<span class='badge rounded-pill bg-" +color + " me-1'>" + tagName + " </span>,";
    }
}

function postGeneralComment(){
    if(! CheckLogin()){
        //show notice
        document.getElementById('warningComment').className = 'toast fade show';
        document.getElementById('warningComment').setAttribute("class", 'toast fade show');
        document.getElementById('warningComment').hidden = false;
        $("#warningComment").show().delay(3000).fadeOut();
    }
    var commentUrl = "http://192.168.31.77:5050/comment/NewComment";
    var questionUrl = 'http://192.168.31.77:5050/question/GetQuesByQuesID/0';
    var base64encodedData = btoa(localStorage.getItem("username") + ":" + localStorage.getItem("password"));
    var comment = document.getElementById("generalComment").value;

    var commentHtml = "";

    var tags = document.getElementById("commentTagResult").innerText.split(',').slice(0,-1);
    if (tags.length == 1){
        // show notice
        document.getElementById('moreTags').className = 'toast fade show';
        document.getElementById('moreTags').setAttribute("class", 'toast fade show');
        document.getElementById('moreTags').hidden = false;
        $("#moreTags").show().delay(3000).fadeOut();
        return;
    }else if(tags.length > 3) {
        // show notice
        document.getElementById('lessTags').className = 'toast fade show';
        document.getElementById('lessTags').setAttribute("class", 'toast fade show');
        document.getElementById('lessTags').hidden = false;
        $("#lessTags").show().delay(3000).fadeOut();
        return;
    }

    if(comment == "" || comment == null){
        // show notice
        document.getElementById('emptyComment').className = 'toast fade show';
        document.getElementById('emptyComment').setAttribute("class", 'toast fade show');
        document.getElementById('emptyComment').hidden = false;
        $("#emptyComment").show().delay(3000).fadeOut();
        return;
    }

    var data = {"questionId":0, "commentText":comment, "commentRating":0, "tags":tags.toString()};
    fetch(commentUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type' : 'application/json',
            "Authorization": "Basic " + base64encodedData,
        }
    })
        .then((response) => response.json())
        .then((data) => {
            document.getElementById('resultTable').innerHTML = "";
            getAllComments();
            // show notice
            document.getElementById('postSuccess').className = 'toast fade show';
            document.getElementById('postSuccess').setAttribute("class", 'toast fade show');
            document.getElementById('postSuccess').hidden = false;
            $("#postSuccess").show().delay(3000).fadeOut();

            document.getElementById("generalComment").value = "";
            document.getElementById("commentTagResult").innerHTML = "<span class='badge rounded-pill bg-secondary me-1'>General </span>,";
            return;
        })
}