var colors_dict = {'Easy':'success', 'Medium':'warning', 'Hard':'danger', 'Python':'primary', 'Java':'secondary', 'C':'success', 'Algorithm':'warning', 'Array':'danger', 'Sorting':'info', 'Math':'primary', 'Counting':'secondary', 'Tree':'success'};

function login(){
    if (localStorage.getItem("username") != null && localStorage.getItem("username") != ""){
        document.getElementById("nav_without_login").style.display = "none";
        document.getElementById("nav_with_login").style.display = "block";
        const url = 'http://192.168.31.77:5050/user/GetUser/';
        fetch(url+localStorage.getItem("username"))
            .then((response) => response.json())
            .then((data) => {
                const questionId = window.location.href.split("questionID")[1].slice(1);
                const qID = questionId.split("#")[0];
                localStorage.setItem("userId",data.userID);
                localStorage.setItem("userPhoto",data.userPhoto);
                document.getElementById('userPhoto').innerHTML = '<img src="Photo/' + data.userPhoto + '.png" alt="UserName" class="rounded-circle img-responsive" width="25" height="25">';
                document.getElementById('LoginUsernameQ').innerHTML = localStorage.getItem('username');
                document.getElementById('postUser').innerHTML = '<img src="Photo/'+ data.userPhoto +'.png" alt="avatar" class="rounded-circle img-fluid img-responsive" width="40">' +
                    '<input type="text" class="form-control mr-3 ms-1" placeholder="Leave a comment here..." id="commentQ'+ qID +'">' +
                    '<button class="btn btn-primary ms-1" type="button" onclick="postComment('+ qID + ')">Post</button>';
            });
    }
}

let id = window.location.href.split("questionID")[1].slice(1);
console.log(id);

function open_question_des(){
    $("#questionDes").css('display','block');
    $("#discuss").css('display','none');
    $("#submitHis").css('display','none');
}

function open_discuss(){
    $("#questionDes").css('display','none');
    $("#discuss").css('display','block');
    $("#submitHis").css('display','none');

}

function get_time_dif_Now(time){
    let data = new Date()
    let times = data.getTime() - time.getTime()
    let day = parseInt(times/(24*1000*3600));// day time
    var leave=times%(24*3600*1000);//计算天数后剩余的毫秒数
    var h =parseInt(leave/(3600*1000));// hour time
    var h_leave=leave%(3600*1000);
    var min=parseInt(h_leave / (60*1000));
    var min_leave=h_leave%(60*1000);
    var sec=parseInt(min_leave/1000);
    return {day: day, hour: h, min:min, sec: sec}




}

function add_submitHis(){
    $.ajax({
        url: "http://192.168.31.77:5050/solution/GetSolusByUserName/" + localStorage.getItem("username"),
        dataType: "json",
        type: 'get',
        headers: {
            Accept: "application/json; charset=utf-8"
        },
        success: function (resp) {
            $('#pageNo').pagination({
                dataSource: resp,
                pageSize: 5,
                prevText: 'Previous',
                nextText: 'Next',
                autoHideNext: true,
                autoHidePrevious: true,
                className: 'paginationjs-theme-blue paginationjs-big',
                callback:   function(resp, pagination) {
                    $("#subBody").html(" ")
                    var time = ""
                    var time_res = ""
                    var result = ""
                    console.log(resp[0])
                    if (id.at(-1) === "#" ){
                        id = id.slice(0,-1)
                    }
                    for (let i=0; i<resp.length;i++){
                        if (resp[i].status === true){
                            result = "<svg t=\"1665709861169\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" " +
                                "xmlns=\"http://www.w3.org/2000/svg\" p-id=\"11285\" width=\"32\" height=\"32\">" +
                                "<path d=\"M512 960C264.96 960 64 759.04 64 512S264.96 64 512 64s448 200.96 448 448S759.04 960 512 960zM" +
                                "512 128.288C300.416 128.288 128.288 300.416 128.288 512c0 211.552 172.128 383.712 383.712 383.712 211.552 0 383.712-172.1" +
                                "6 383.712-383.712C895.712 300.416 723.552 128.288 512 128.288z\" p-id=\"11286\" fill=\"#53af08\"></path><path d=\"M726.9" +
                                "76 393.184c-12.544-12.448-32.832-12.32-45.248 0.256l-233.28 235.84-103.264-106.112c-12.352-12.704-32.608-12.928-45.248-0.64-" +
                                "12.672 12.32-12.96 32.608-0.64 45.248l126.016 129.504c0.064 0.096 0.192 0.096 0.256 0.192 0.064 0.064 0.096 0.192 0.16 0" +
                                ".256 2.016 1.984 4.512 3.2 6.88 4.544 1.248 0.672 2.24 1.792 3.52 2.304 3.872 1.6 8 2.4 12.096 2.4 4.064 0 8.128-0.8 11.96" +
                                "8-2.336 1.248-0.512 2.208-1.536 3.392-2.176 2.4-1.344 4.896-2.528 6.944-4.544 0.064-0.064 0.096-0.192 0.192-0.256 0.064-0." +
                                "096 0.16-0.128 0.256-0.192l256.224-259.008C739.648 425.856 739.52 405.6 726.976 393.184z\" p-id=\"11287\" fill=\"#53af08\"></path></svg> " +
                                "<span class='text-success'>Accepted</span>"
                        }else {
                            result = "<svg t=\"1665710437492\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"12304\" " +
                                "width=\"32\" height=\"32\"><path d=\"M512 64c259.2 0 469.333333 200.576 469.333333 448s-210.133333 448-469.333333 448a484.48 484.48 0 0 1-232.7253" +
                                "33-58.88l-116.394667 50.645333a42.666667 42.666667 0 0 1-58.517333-49.002666l29.76-125.013334C76.629333 703.402667 42.666667 611.477333 42.66" +
                                "6667 512 42.666667 264.576 252.8 64 512 64z m0 64C287.488 128 106.666667 300.586667 106.666667 512c0 79.573333 25.557333 155.434667 72.55" +
                                "4666 219.285333l5.525334 7.317334 18.709333 24.192-26.965333 113.237333 105.984-46.08 27.477333 15.018667C370.858667 878.229333 439.978" +
                                "667 896 512 896c224.512 0 405.333333-172.586667 405.333333-384S736.512 128 512 128z m-100.309333 234.666667a8.533333 8.533333 0 0 1 6.037" +
                                "333 2.496l93.909333 93.909333 93.866667-93.909333a8.533333 8.533333 0 0 1 6.058667-2.496h66.389333a8.533333 8.533333 0 0 1 6.037333 14.570" +
                                "666l-127.104 127.082667 121.109334 121.109333a8.533333 8.533333 0 0 1-6.037334 14.570667h-66.346666a8.533333 8.533333 0 0 1-6.037334-2.496" +
                                "l-87.936-87.936-87.957333 87.936a8.533333 8.533333 0 0 1-6.037333 2.496h-66.346667a8.533333 8.533333 0 0 1-6.016-14.570667l121.109333-121.10" +
                                "9333-127.104-127.082667a8.533333 8.533333 0 0 1 6.037334-14.570666h66.368z\" fill=\"#d81e06\" p-id=\"12305\"></path></svg>" +
                                "<span class='text-danger'> Wrong Answre</span>"
                        }
                        time = resp[i].submitDate.slice(0,10) + " " + resp[i].submitDate.slice(11,19)
                        time = new Date(time.replace(/-/g,"/"))
                        time = get_time_dif_Now(time)


                        if (time.day > 7){
                            time_res = resp[i].submitDate.slice(0,10)
                        }
                        else if (time.day <= 7 && time.day >= 1){
                            time_res = time.day + " Days ago"
                        }
                        else if (time.day <= 1 && time.hour < 24 && time.hour >= 1){
                            time_res = time.hour + " Hours ago"
                        }
                        else if (time.day < 1 && time.hour < 1 && time.min >= 1 && time.min<60){
                            time_res = time.min + " Minutes ago"
                        }
                        else if (time.day < 1 && time.hour < 1 && time.min < 1 && time.sec<60 && time.sec>10){
                            time_res = time.sec + " Seconds ago"
                        }
                        else if (time.day < 1 && time.hour < 1 && time.min < 1 && time.sec<10){
                            time_res = "just now"
                        }
                        else {
                            time_res = "time"
                        }



                        if (String(resp[i].questionID) === id){
                            var toggleID = "code"+String(i)
                            var aceID = "ace" + String(i)
                            $("#subBody").append(
                                  "<tr>\n" +
                                "<td>" + result + "</td>\n" +
                                "<td>"+ time_res +"</td>\n" +
                                "<td>"+
                                "<a class=\"btn text-primary\" data-bs-toggle=\"modal\" data-bs-target=\"#"+ toggleID +"\">\n" +
                                "  View Code\n" +
                                "</a>\n" +
                                "\n" +
                                "<!-- Modal -->\n" +
                                "<div class=\"modal fade\" id="+ toggleID +" tabindex=\"-1\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">\n" +
                                "  <div class=\"modal-dialog modal-dialog-centered modal-dialog-scrollable\">\n" +
                                "    <div class=\"modal-content\">\n" +
                                "      <div class=\"modal-header\">\n" +
                                "        <h5 class=\"modal-title\" id=\"exampleModalLabel\"><h3 class='text-center'>CODE</h3></h5>\n" +
                                "        <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n" +
                                "      </div>\n" +
                                "      <div class=\"modal-body\" style='height: 500px' id='"+ aceID +"'>\n" +
                                // resp[i].solutionContext+
                                "      </div>\n" +
                                "      <div class=\"modal-footer\">\n" +
                                "        <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\">Close</button>\n" +
                                "      </div>\n" +
                                "    </div>\n" +
                                "  </div>\n" +
                                "</div>" +"</td>\n" +
                                "</tr>"
                            )
                            // document.getElementById(aceID).innerHTML = i
                            let editor = ace.edit(aceID)
                            //editor.setTheme("ace/theme/github")
                            editor.session.setMode(`ace/mode/python`)
                            editor.setOptions({
                                autoScrollEditorIntoView: true,
                                copyWithEmptySelection: true,
                                mergeUndoDeltas: "always",
                                animatedScroll: true,
                                readOnly:true,
                                fontSize: 15

                            })
                            editor.insert(resp[i].solutionContext)
                        }
                    }

                }
            })
        }
    })
}

function open_sub_his(){
    if(CheckLogin()){
        $("#questionDes").css('display','none');
        $("#discuss").css('display','none');
        $("#submitHis").css('display','block');
        add_submitHis();
    }
}

const userPhotoID = localStorage.getItem("userPhoto");


function setUpAce(language){
    let editor = ace.edit("code");
    editor.setTheme("ace/theme/github");
    editor.session.setMode(`ace/mode/`+language);

    // use setOptions method to set several options at once
    editor.setOptions({
        autoScrollEditorIntoView: true,
        copyWithEmptySelection: true,
    });
    // use setOptions method
    editor.setOption("mergeUndoDeltas", "always");

    if(language.toLowerCase() == "python"){
        // default code
        editor.insert(`print("hello World")`);
    }else if(language.toLowerCase() == "java"){
        // default code
        editor.insert(`public class test{
    public static void main(String[] args){

    }
}`);
    }else{
        // default code
        ace.insert(`#include <stdio.h>
int main() {
    printf("Hello World!");
}`)
    }

    document.getElementById('code').style.fontSize='16px';
}

// [["c","9.3.0"],["cpp","9.3.0"],["java","11.0.13"],["nodejs","10.19.0"],["octave","5.2.0"],["pascal","3.0.4"],["php","7.4.3"],["python3","3.9.1"]]
$.ajax({
    url: "http://192.168.31.77:5050/question/GetQuesByQuesID/"+id,
    dataType:"json",
    type: 'get',
    headers: {
        Accept: "application/json; charset=utf-8"
    },
    success:function (resp) {
        let testcase = resp.testCase.split("%$#,")
        let final = testcase.pop().slice(0,-3)
        testcase.push(final)
        console.log(testcase)
        for (let i = 0;i<testcase.length;i++){
            if (i%2===0){
                $("#testcase").append(
                    "<h4 class='mb-2'>Test Case "+(Math.floor(i/2)+1) + ":</h4><div class=\"bg-light rounded-3 example\"><code style=\" font-size: 16px; white-space: pre-line;\">" + testcase[i].replaceAll("\\n", "<br>") + "</code></div><br>"
                )}
            else{
                $("#testcase").append(
                    "<h4 class='mb-2'>Expected Output "+(Math.floor(i/2)+1) + ": </h4><div class=\"bg-light rounded-3 example\" style='white-space: pre-line;'>" + testcase[i].replaceAll("%%n",'<br>').replaceAll('%%(spacing)', '&nbsp') + "</div><br>"
                )}
        }
        $("#funcDes").html(resp.runMethod);
        $("#quesDes").html(resp.description);
        if (resp.tags.split(",").length == 3){
            var color = colors_dict[resp.tags.split(",")[2]];
            $("#otherTag").attr("class", "btn btn-"+color);
            $("#otherTag").html(resp.tags.split(",")[2]);
            document.getElementById('otherTag').hidden = false;
        }

        console.log(resp.difficulty_level)
        $("#difficulty").attr("class", "btn btn-"+colors_dict[resp.difficulty_level]);
        $("#difficulty").html(resp.difficulty_level)
        document.getElementById('difficulty').hidden = false;

        $("#quesTitle").html(resp.questionTitle)

        let language = resp.tags.split(",")[0];
        $("#language").html(language);
        $("#language").attr("class", "btn btn-"+colors_dict[language]);
        var base64encodedData = btoa(localStorage.getItem("username") + ":" + localStorage.getItem("password"));
        if (language === "C"){
            $("#postCode").click(function(){
                if((localStorage.getItem("username") != null && localStorage.getItem("username") != '')) {
                    let a = monaco.editor.getModels()[0].getValue()
                    $.ajax({
                        url: "http://3.27.43.135/jobe/index.php/restapi/runs",  //登录的接口URL
                        dataType: "json",
                        data: {
                            run_spec: {"language_id": "c", "sourcefilename": "test.c", "sourcecode": a}
                        },
                        type: 'post', //post类型
                        headers: {
                            Accept: "application/json; charset=utf-8"
                        },
                        success: function (resp) {
                            console.log(resp)
                            if (resp.stdout !== "" && resp.cmpinfo === "" && resp.stderr === "") {
                                $("#runRes").attr("class", "alert alert-info")
                                $("#runRes").html("<h2>execution result</h2>" + resp.stdout.replaceAll("\n", "<br>"))
                            } else if (resp.stdout === "" && resp.cmpinfo !== "" && resp.stderr === "") {
                                $("#runRes").attr("class", "alert alert-danger")
                                $("#runRes").html("<h2>Error</h2>" + resp.cmpinfo)
                            } else if (resp.stdout === "" && resp.cmpinfo === "" && resp.stderr !== "") {
                                $("#runRes").attr("class", "alert alert-warning")
                                $("#runRes").html("<h2>Error</h2>" + resp.stderr)
                            }
                        },
                    })
                }
                else{
                    CheckLogin();
                }
            });

        }
        else if (language === "Python"){
            $("#postCode").click(function(){
                $("#runRes").attr("class", "");
                $("#runRes").html("");
                if((localStorage.getItem("username") != null) && localStorage.getItem("username") != "") {
                    let a = monaco.editor.getModels()[0].getValue();

                    $.ajax({
                        url: "http://192.168.31.77:5050/question/GetQuesByQuesID/" + id,
                        dataType: "json",
                        type: 'get',
                        headers: {
                            Accept: "application/json; charset=utf-8"
                        },
                        success: function (response) {
                            var userTesting = [];
                            var expectResult = [];
                            var testCases = [];
                            for (let i = 0; i < testcase.length; i++) {
                                if (i % 2 == 0) {
                                    userTesting.push(a + '\r\n' + testcase[i].replaceAll('\\n', '\r\n'));
                                    testCases.push(testcase[i].replaceAll('\\n', '\n'));
                                }else{
                                    expectResult.push(testcase[i].replaceAll('\\n', '\n').replaceAll('%%n', '\n').replaceAll('%%(spacing)', '&nbsp'));
                                }
                            }
                            var resultTable = "";
                            var status = true;
                            for (let i = 0; i < userTesting.length; i++){
                                $.ajax({
                                    url: "http://3.27.43.135/jobe/index.php/restapi/runs",  //登录的接口URL
                                    dataType: "json",
                                    data: {
                                        run_spec: {
                                            "language_id": "python3",
                                            "sourcefilename": "test.py",
                                            "sourcecode": userTesting[i]
                                        }
                                    },
                                    type: 'post', //post类型
                                    headers: {
                                        Accept: "application/json; charset=utf-8"
                                    },
                                    success: function (resp) {
                                        // $("#runRes").html("<b>out: </b>"+resp.stdout + "<br><b>info: </b>" + resp.cmpinfo + "<br><b>error: </b>" +resp.stderr)
                                        console.log(resp);
                                        if (resp.stdout !== "" && resp.cmpinfo === "" && resp.stderr === "") {
                                            //$("#runRes").attr("class", "alert alert-info")
                                            //$("#runRes").html("<h2>execution result</h2>" + resp.stdout.replaceAll("\n", "<br>"))
                                            expectResult[i] = expectResult[i].replaceAll('%%n', '\n').replaceAll('%%(spacing)', '&nbsp');
                                            if(resp.stdout.replaceAll(' ','&nbsp') == expectResult[i]){
                                                //right
                                                resultTable += "<tr style='background-color: #99ff99;'><td style='white-space: pre-line;'>" + testCases[i] + '</td><td style=\'white-space: pre-line;\'>' + expectResult[i].replaceAll("\n", "<br>") + '</td><td style=\'white-space: pre-line;\'>'+resp.stdout.replaceAll(" ", "&nbsp").replaceAll("\n", "<br>") + '</td><td>';
                                                resultTable += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#00cc00" class="bi bi-check-lg" viewBox="0 0 16 16">' +
                                                    '<path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>' +
                                                    '</svg></td></tr>';
                                            }else{
                                                //wrong
                                                resultTable += "<tr style='background-color: #ffb3b3;'><td style='white-space: pre-line;'>"  + testCases[i] + '</td><td style=\'white-space: pre-line;\'>' + expectResult[i].replaceAll("\n", "<br>") + '</td><td style=\'white-space: pre-line;\'>'+resp.stdout.replaceAll(" ", "&nbsp").replaceAll("\n", "<br>") + '</td><td>';
                                                resultTable += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cc0000" class="bi bi-x" viewBox="0 0 16 16">' +
                                                    '<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>' +
                                                    '</svg></td></tr>';
                                                document.getElementById("CodeContent").style.backgroundColor = "#fff3e6";
                                                status = false;
                                            }
                                        } else if (resp.stdout === "" && resp.cmpinfo !== "" && resp.stderr === "") {
                                            document.getElementById("CodeContent").style.backgroundColor = "#ffe6e6";
                                            $("#runRes").attr("class", "me-5 ms-5 alert alert-danger")
                                            $("#runRes").html("<h2>Error</h2>" + resp.cmpinfo);
                                            resultTable += "<tr style='background-color: #ffb3b3;'><td style='white-space: pre-line;'>"  + testCases[i] + '</td><td style=\'white-space: pre-line;\'>' + expectResult[i].replaceAll("\n", "<br>") + '</td><td>';
                                            resultTable += resp.cmpinfo+'</td><td>';
                                            //wrong
                                            resultTable += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cc0000" class="bi bi-x" viewBox="0 0 16 16">' +
                                                '<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>' +
                                                '</svg></td></tr>';
                                            status = false;
                                        } else if (resp.stdout === "" && resp.cmpinfo === "" && resp.stderr !== "") {
                                            document.getElementById("CodeContent").style.backgroundColor = "#fff3e6";
                                            $("#runRes").attr("class", "me-5 ms-5 alert alert-warning")
                                            $("#runRes").html("<h2>Error</h2>" + resp.stderr)
                                            resultTable += "<tr style='background-color: #ffb3b3'><td style='white-space: pre-line;'>" + testCases[i] + '</td><td style=\'white-space: pre-line;\'>' + expectResult[i].replaceAll("\n", "<br>") + '</td><td style=\'white-space: pre-line;\'>';
                                            resultTable += resp.stderr+'</td><td>';
                                            //wrong
                                            resultTable += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cc0000" class="bi bi-x" viewBox="0 0 16 16">' +
                                                '<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>' +
                                                '</svg></td></tr>';
                                            status = false;
                                        } else {
                                            document.getElementById("CodeContent").style.backgroundColor = "#ffe6e6";
                                            //$("#runRes").attr("class", "me-5 ms-5 alert alert-danger")
                                            //$("#runRes").html("<h2>Error</h2>" + resp.stderr)
                                            resultTable += "<tr style='background-color: #ffb3b3'><td style='white-space: pre-line;'>" + testCases[i] + '</td><td style=\'white-space: pre-line;\'>' + expectResult[i].replaceAll("\n", "<br>") + '</td><td style=\'white-space: pre-line;\'>';
                                            resultTable += resp.stderr+'</td><td>';
                                            //wrong
                                            resultTable += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cc0000" class="bi bi-x" viewBox="0 0 16 16">' +
                                                '<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>' +
                                                '</svg></td></tr>';
                                            status = false;
                                        }
                                        document.getElementById("test-result").innerHTML = resultTable;
                                        document.getElementById('testResult').hidden = false;
                                        if (id.at(-1) === "#") {
                                            id = id.slice(0, -1)
                                        }
                                        let data = JSON.stringify({
                                            "questionID": Number(id),
                                            "status": status,
                                            "solutionContext": a,
                                            "tags": "string"
                                        });
                                        if(i == userTesting.length-1){
                                            var base64encodedData = btoa(localStorage.getItem("username") + ":" + localStorage.getItem("password"));
                                            $.ajax({
                                                url: "http://192.168.31.77:5050/solution/AddSolution",
                                                dataType: "json",
                                                useDefaultXhrHeader: false,
                                                type: "post",
                                                data: data,
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    "Authorization": "Basic " + base64encodedData,
                                                },
                                                success: function (data) {
                                                    if(status == true){
                                                        document.getElementById("CodeContent").style.backgroundColor = "#e6ffe6";
                                                        //notice
                                                        document.getElementById('ansSuccess').className = 'toast fade show';
                                                        document.getElementById('ansSuccess').setAttribute("class", 'toast fade show');
                                                        document.getElementById('ansSuccess').hidden = false;
                                                        $("#ansSuccess").show().delay(3000).fadeOut();
                                                    }
                                                    add_submitHis()
                                                }
                                            });
                                        }
                                    },
                                });
                            }
                        },
                    });
                }
                else{
                    CheckLogin();
                }
            });
        }
        else if (language === "Java"){
            $("#postCode").click(function(){
                if((localStorage.getItem("username") != null && localStorage.getItem("username") != "")) {
                    let a = monaco.editor.getModels()[0].getValue()
                    $.ajax({
                        url: "http://3.27.43.135/jobe/index.php/restapi/runs",  //登录的接口URL
                        dataType: "json",
                        data: {
                            run_spec: {"language_id": "java", "sourcefilename": "test.java", "sourcecode": a}
                        },
                        type: 'post', //post类型
                        headers: {
                            Accept: "application/json; charset=utf-8"
                        },
                        success: function (resp) {
                            console.log(resp)
                            if (resp.stdout !== "" && resp.cmpinfo === "" && resp.stderr === "") {
                                $("#runRes").attr("class", "alert alert-info")
                                $("#runRes").html("<h2>execution result</h2>" + resp.stdout)
                            } else if (resp.stdout === "" && resp.cmpinfo !== "" && resp.stderr === "") {
                                $("#runRes").attr("class", "alert alert-danger")
                                $("#runRes").html("<h2>Error</h2>" + resp.cmpinfo)
                            } else if (resp.stdout === "" && resp.cmpinfo === "" && resp.stderr !== "") {
                                $("#runRes").attr("class", "alert alert-warning")
                                $("#runRes").html("<h2>Error</h2>" + resp.stderr)
                            }
                        },
                    })
                }
                else{
                    CheckLogin();
                }
            });
        }
    },
})

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
            document.getElementById("likeCount"+commentId).innerText = "1 Likes";
            document.getElementById("likeCount"+commentId).className = "likeComment mt-3";
            document.getElementById("likeCount"+commentId).setAttribute("class", "likeComment mt-3");
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
                    var followHtml = '<div class="col-2"></div><div class="col-10 card card-body">';
                    data.forEach(follow => {
                        if (follow.following != null && follow.following != ""){
                            followComment.push(follow.following);
                            followCommentUser.push(follow.userID);
                            followCommentPhotos.push(follow.photo);
                        }
                    });
                    for (let i = 0; i < followCommentUser.length; i++){
                        followHtml += '<div class="row"><div class="col-10 p-bg-green follow-up-discussions"><p>' + followComment[i] +'</p></div>' +
                            '<div class="col"><img src="Photo/'+ followCommentPhotos[i] +'.png" alt="avatar" class="rounded-circle img-fluid img-responsive" style="width: 70px;"></div></div><br>';
                    }
                    followHtml += '<div class="d-flex flex-row add-comment-section mt-4"><img src="Photo/'+ userPhotoID +'.png" alt="avatar" class="rounded-circle img-fluid img-responsive" width="40">' +
                        '<input type="text" class="form-control mr-3 ms-1" placeholder="Join discussion..." id="addComment' + commentID + '">' +
                        '<button class="btn btn-primary ms-1" type="button" onclick="postFollowComment('+ commentID +')">Post</button></div></div>';
                    document.getElementById(id).innerHTML = followHtml;

                    // show notice
                    document.getElementById('postSuccess').className = 'toast fade show';
                    document.getElementById('postSuccess').setAttribute("class", 'toast fade show');
                    document.getElementById('postSuccess').hidden = false;
                    $("#postSuccess").show().delay(1000).fadeOut();
                })
        });
}

function postComment(questionId){
    var commentUrl = "http://192.168.31.77:5050/comment/NewComment";
    var questionUrl = 'http://192.168.31.77:5050/question/GetQuesByQuesID/' + questionId;
    var base64encodedData = btoa(localStorage.getItem("username") + ":" + localStorage.getItem("password"));
    var comment = document.getElementById("commentQ" + questionId).value;
    var commentHtml = "";

    if(comment == "" || comment == null){
        // show notice
        document.getElementById('emptyComment').className = 'toast fade show';
        document.getElementById('emptyComment').setAttribute("class", 'toast fade show');
        document.getElementById('emptyComment').hidden = false;
        $("#emptyComment").show().delay(3000).fadeOut();
        return;
    }

    fetch(questionUrl)
        .then(response => response.json())
        .then(data => {
            var tags = data.tags;
            var data = {"questionId":questionId, "commentText":comment, "commentRating":0, "tags":tags};
            var userPhoto = localStorage.getItem("userPhoto");

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
                    var commentID = data.commentID;
                    var likeButton = '<button class="like-button" onmousedown="clickLike('+ commentID +')"><div class="like-wrapper"><div class="ripple"></div><svg class="heart" width="24" height="24" viewBox="0 0 24 24">' +
                        '<path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>' +
                        '</svg><div class="particles" style="--total-particles: 6"><div class="particle" style="--i: 1; --color: #7642F0"></div>' +
                        '<div class="particle" style="--i: 2; --color: #AFD27F"></div><div class="particle" style="--i: 3; --color: #DE8F4F"></div>' +
                        '<div class="particle" style="--i: 4; --color: #D0516B"></div><div class="particle" style="--i: 5; --color: #5686F2"></div>' +
                        '<div class="particle" style="--i: 6; --color: #D53EF3"></div></div></div></button></div></div></div><br>';

                    commentHtml += '<div class="row"><div class="col"><img src="Photo/'+ userPhoto +'.png" alt="avatar" class="rounded-circle img-fluid img-responsive" style="width: 70px;">' +
                        '</div><div class="col-10 p-bg-blue me-3"><p>' + comment + '</p>' +
                        '<div class="row d-flex justify-content-end heart_container me-3 mb-3"><button class="btn btn-outline-primary col-3" data-bs-toggle="collapse" data-bs-target="#follow'+ commentID +'" aria-expanded="false" aria-controls="follow'+ commentID +'">View More</button>' +
                        '<div class="col-6"></div><span class="dislikeComment mt-3" id="likeCount'+ commentID +'" style="width:auto; color:#c0c0c0">0 Likes</span>' + likeButton +
                        '<div class="collapse container mb-3 row" id = "follow' + commentID + '"><div class="col-2"></div><div class="card card-body col-10">This comment doesn\'t have any follow up discussion.'+
                        '<div class="d-flex flex-row add-comment-section mt-4"><img src="Photo/'+ userPhotoID +'.png" alt="avatar" class="rounded-circle img-fluid img-responsive" width="40">' +
                        '<input type="text" class="form-control mr-3 ms-1" placeholder="Join discussion..." id="addComment' + commentID +'">' +
                        '<button class="btn btn-primary ms-1" type="button" onclick="postFollowComment('+ commentID +')">Post</button></div></div></div>';

                    if (document.getElementById("comments").innerText.split("\n").includes("Oops, no comments for this question yet.")){
                        var inner = '<div class="d-flex flex-row add-comment-section mt-4 mb-4" id="postUser"><img src="Photo/'+ userPhoto +'.png" alt="avatar" class="rounded-circle img-fluid img-responsive" width="40">' +
                            '<input type="text" class="form-control mr-3 ms-1" placeholder="Leave a comment here..." id="commentQ'+ questionId +'">' +
                            '<button class="btn btn-primary ms-1" type="button" onclick="postComment('+ questionId + ')">Post</button></div>' + commentHtml
                        document.getElementById("comments").innerHTML = inner;
                    }else{
                        document.getElementById("comments").innerHTML += commentHtml;
                    }

                    // show notice
                    document.getElementById('postSuccess').className = 'toast fade show';
                    document.getElementById('postSuccess').setAttribute("class", 'toast fade show');
                    document.getElementById('postSuccess').hidden = false;
                    $("#postSuccess").show().delay(1000).fadeOut();
                });
        });
}

function getAllComment(){
    var url = "http://192.168.31.77:5050/comment/GetCommentByQuestionID/" + id
    const followUrl = "http://192.168.31.77:5050/comment/GetFollowComment/";

    fetch(url)
        .then((response) => response.json())
        .then((data) => {

            data.forEach(d =>{
                // Comment Out DTO
                var content = d.commentText;
                var userId = d.userId;
                var userPhoto = d.photo;
                var postTime = d.createdDate.split('T')[0];
                var commentID = d.commentID;

                var commentHtml = '';
                var likeButton = '<button class="like-button" onmousedown="clickLike('+ commentID +')"><div class="like-wrapper"><div class="ripple"></div><svg class="heart" width="24" height="24" viewBox="0 0 24 24">' +
                    '<path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>' +
                    '</svg><div class="particles" style="--total-particles: 6"><div class="particle" style="--i: 1; --color: #7642F0"></div>' +
                    '<div class="particle" style="--i: 2; --color: #AFD27F"></div><div class="particle" style="--i: 3; --color: #DE8F4F"></div>' +
                    '<div class="particle" style="--i: 4; --color: #D0516B"></div><div class="particle" style="--i: 5; --color: #5686F2"></div>' +
                    '<div class="particle" style="--i: 6; --color: #D53EF3"></div></div></div></button></div></div></div><br>'

                commentHtml += '<div class="row"><div class="col"><img src="Photo/'+ userPhoto +'.png" alt="avatar" class="rounded-circle img-fluid img-responsive" style="width: 70px;">' +
                    '</div><div class="col-10 p-bg-blue me-3"><p>' + content + '</p>';

                fetch(followUrl+commentID)
                    .then((response) => response.json())
                    .then(data => {
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
                        commentHtml += '<div class="row d-flex justify-content-end heart_container me-3 mb-3"><button class="btn btn-outline-primary col-3" data-bs-toggle="collapse" data-bs-target="#follow'+ commentID +'" aria-expanded="false" aria-controls="follow'+ commentID +'">View More</button>' +
                            '<div class="col-6"></div><span class="'+ className + ' mt-3" id="likeCount'+ commentID +'" style="width:auto; color:' + color + '">'+ likes +' Likes</span>' + likeButton;

                        if (followComment.length == 0){
                            commentHtml += '<div class="collapse container mb-3 row" id="follow'+ commentID +'"><div class="col-2"></div><div class="col-10 card card-body">This comment doesn\'t have any follow up discussion.' +
                                '<div class="d-flex flex-row add-comment-section mt-4"><img src="Photo/'+ userPhotoID +'.png" alt="avatar" class="rounded-circle img-fluid img-responsive" width="40">' +
                                '<input type="text" class="form-control mr-3 ms-1" placeholder="Join discussion..." id="addComment' + commentID +'">' +
                                '<button class="btn btn-primary ms-1" type="button" onclick="postFollowComment('+ commentID +')">Post</button></div></div></div>';
                        }else{
                            commentHtml += '<div class="collapse container mb-3 row" id="follow'+ commentID +'"><div class="col-2"></div><div class="col-10 card card-body">';
                            for (let i = 0; i < followCommentUser.length; i++){
                                commentHtml += '<div class="row mb-3"><div class="col-10 p-bg-green follow-up-discussions"><p>' + followComment[i] +'</p></div>' +
                                    '<div class="col"><img src="Photo/'+ followCommentPhotos[i] +'.png" alt="avatar" class="rounded-circle img-fluid img-responsive" style="width: 70px;"></div></div>';
                            }
                            commentHtml += '<div class="d-flex flex-row add-comment-section mt-4"><img src="Photo/'+ userPhotoID +'.png" alt="avatar" class="rounded-circle img-fluid img-responsive" width="40">' +
                                '<input type="text" class="form-control mr-3 ms-1" placeholder="Join discussion..." id="addComment' + commentID + '">' +
                                '<button class="btn btn-primary ms-1" type="button" onclick="postFollowComment('+ commentID +')">Post</button></div></div></div></div>';
                        }
                        document.getElementById("comments").innerHTML += commentHtml;
                    })
                    .catch(function(e){
                        commentHtml += '<div class="row d-flex justify-content-end heart_container me-3 mb-3"><button class="btn btn-outline-primary col-3" data-bs-toggle="collapse" data-bs-target="#follow'+ commentID +'" aria-expanded="false" aria-controls="follow'+ commentID +'">View More</button>' +
                            '<div class="col-6"></div><span class="dislikeComment mt-3" id="likeCount'+ commentID +'" style="width:auto; color:#c0c0c0">0 Likes</span>' + likeButton +
                            '<div class="collapse container mb-3 row" id = "follow' + commentID + '"><div class="col-2"></div><div class="col-10 card card-body">This comment doesn\'t have any follow up discussion.' +
                            '<div class="d-flex flex-row add-comment-section mt-4"><img src="Photo/'+ userPhotoID +'.png" alt="avatar" class="rounded-circle img-fluid img-responsive" width="40">' +
                            '<input type="text" class="form-control mr-3 ms-1" placeholder="Join discussion..." id="addComment' + commentID +'">' +
                            '<button class="btn btn-primary ms-1" type="button" onclick="postFollowComment('+ commentID +')">Post</button></div></div></div>';
                        document.getElementById("comments").innerHTML += commentHtml;
                    });
            });
        })
        .catch(function(e){
            const url = 'http://192.168.31.77:5050/user/GetUser/';
            fetch(url+localStorage.getItem("username"))
                .then((response) => response.json())
                .then((data) => {
                    document.getElementById("comments").innerHTML += '<h3 class="text-center mt-5">Oops, no comments for this question yet.</h3>'
                })
                .catch(function(e){
                    document.getElementById("comments").innerHTML += '<h3 class="text-center mt-5">Oops, no comments for this question yet.</h3>'
                });
        });
}

function CheckLogin(){
    if((localStorage.getItem("username") == '' || localStorage.getItem("username") == null)){
        document.getElementById('ModalForm').style.display = 'block';
        document.getElementById('CodeContent').style.filter = "blur(20px)";
        document.getElementById('testcase').style.filter = "blur(20px)";
        document.getElementById('questionDes').style.filter = "blur(20px)";
        document.getElementById('CodeNav').style.filter = "blur(20px)";
        document.getElementById('quesTitle').style.filter = "blur(20px)";
        document.getElementById('QuesType').style.filter = "blur(20px)";
        document.getElementById('UserOpt').style.filter =  "blur(20px)";
        document.getElementById('discuss').style.filter =  "blur(20px)";
        document.getElementById('submitHis').style.filter =  "blur(20px)";
        return false;
    }
    return true;
}

function CloseUp(){
    document.getElementById('ModalForm').style.display = 'none';
    document.getElementById('CodeContent').style.filter = "none";
    document.getElementById('testcase').style.filter = "none";
    document.getElementById('questionDes').style.filter = "none";
    document.getElementById('CodeNav').style.filter = "none";
    document.getElementById('quesTitle').style.filter = "none";
    document.getElementById('QuesType').style.filter ="none";
    document.getElementById('UserOpt').style.filter = "none";
    document.getElementById('discuss').style.filter =  "none";
    document.getElementById('submitHis').style.filter =  "none";
}

function UserLogin(){
    let username1 = document.getElementById("Username").value;
    let password1 = document.getElementById("Password").value;

    if(localStorage.getItem('username') == "" || localStorage.getItem('username') == null ||  localStorage.getItem('username') == undefined  ){
        localStorage.setItem("username",username1);
        localStorage.setItem("password",password1);
    }

    if (username1 == "" || username1 == null){
        document.getElementById("LoginHelp1").innerHTML = `<p style="color: red">Please enter your username and password!`;
    } else {
        encode = btoa(localStorage.getItem("username") + ":" + localStorage.getItem("password"));
        const fetchPromise = fetch("http://192.168.31.77:5050/api/GetVersionA", {headers: {"Authorization": "Basic " + encode,}});
        fetchPromise.then((response) => {
            if (response.status !== 200) {
                throw new Error(response.status)
            } else {
                response.text().then((data) => {
                    alert(`Hello ${username1}, Welcome to our website of ${data} version`);
                    document.getElementById("nav_without_login").style.display = "none";
                    document.getElementById("nav_with_login").style.display = "block";
                    document.getElementById('LoginUsernameQ').innerHTML = localStorage.getItem('username');
                    login();
                    CloseUp();
                })
            }
        })
    }
}

function close_sign_in(){
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signUp").style.display = "block";
}

function close_sign_up(){
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("signUp").style.display = "none";
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
    }else if(email == "" || email == null){
        document.getElementById("EmailHelp").innerHTML = `<p style="color: red">Please fill your Email!`;
    }else {
        const user = {'userName': UserName, 'email': email, 'password': UserPassword1, "description": ""};
        //const user = {'userName': "123231", 'email': "test1@gmail.com", 'password': "test123", "description": ""};

        fetch("http://192.168.31.77:5050/user/NewUser", {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(user)
        })
            .then((response) => {
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
                        document.getElementById("signUp").style.display = "none";
                        document.getElementById("username_input").value = "";
                        document.getElementById("email_input").value = "";
                        document.getElementById("passwordInput1").value = "";
                        document.getElementById("passwordInput2").value = "";

                        document.getElementById("loginForm").style.display = "block";
                        document.getElementById("Username").value = UserName;
                    });
                }
            })
            .catch(function (error){
                console.log(JSON.stringify(error))
            })
    }

}

getAllComment();
