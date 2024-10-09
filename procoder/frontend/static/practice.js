var colors_dict = {'Easy':'success', 'Medium':'warning', 'Hard':'danger', 'Python':'primary', 'Java':'secondary', 'C':'success', 'Algorithm':'warning', 'Array':'danger', 'Sorting':'info', 'Math':'primary', 'Counting':'secondary', 'Tree':'success'};

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
            });
    }
}

function getAllQuestions(){
    var url = "http://192.168.31.77:5050/question/GetAllQuestions";
    //var base64encodedData = btoa(localStorage.getItem("username") + ":" + localStorage.getItem("password"));
    fetch(url, {
        //headers:{
        //"Authorization": "Basic " + base64encodedData,
        //}
    })
        .then((response) => response.json())
        .then((data) => {
            data.forEach(d => {
                if(d.questionID != 0){
                    var content = d.description;
                    var title = d.questionTitle;
                    var postDate = d.postDate.split('T')[0];
                    var tags = d.tags.split(',');
                    var id = d.questionID;
                    var tagHtml = "";
                    tags.forEach(element => {
                        tagHtml += '<span class="badge rounded-pill bg-' + colors_dict[element] + ' me-1">' + element + ' </span>';
                    });
                    document.getElementById("resultTable").innerHTML += '<tr class="bg-blue" data-bs-toggle="modal" data-bs-target="#staticBackdrop' + id + '">' +
                        '<td><strong>' + title + ': </strong>' + content + '</td>\t\n\t\n<td>' + tagHtml + '</td>\t\n\t\n<td> </td><td>'+postDate +'</td></tr>' +
                        '<div class="modal fade" id="staticBackdrop' + id + '" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">\n' +
                        '<div class="modal-dialog modal-lg modal-dialog-centered">\n' +
                        '<div class="modal-content" style="background-color: transparent; border: none">\n' +
                        '<div class="modal-body" style="overflow-x: hidden; overflow-y:hidden"><div class="container-fluid"><div class="row"><div class="card border-warning">' +
                        '<div class="card-body"><div class="row justify-content-end"><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
                        '</div><div class="collapse show" id="description"><h5 class="card-title"><strong>Question Title:</strong> ' + title + '</h5><br>' +
                        '<p class="card-text"><strong>Question Description:</strong>' + '<p>' + content + '</p>' +
                        '</div><div class="row"><div class="col-10"><a href="question.html?questionID='+id+'" class="btn btn-outline-success">View Question</a></div></div></div></div></div></div></div></div></div></div>';

                }
            })
        });
}
