var count = 2;
var maxFile = 5;
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


//Post page



function DeletePosting(id) {
    var addButton = document.getElementById("addButton");


    //Determine is the count meet the maxFile
    if (count < maxFile) {
        addButton.style.display = "block"
    } else {
        addButton.style.display = "none"
    }

    //Delete the case
    document.getElementById(id).parentNode.removeChild(document.getElementById(id))


    //Reorder the case
    let new_id = parseInt(id[9])
    console.log(new_id)

    while (new_id < count) {
        console.log(new_id)
        document.getElementById("TestCase_" + (new_id + 1)).id = "TestCase_" + new_id
        document.getElementById("TestCase_" + (new_id + 1) + "_label").outerHTML =
            `<label id="TestCase_${new_id}_label" class="form-label mb-3 mt-3">
                <strong>Test Case${new_id}</strong>
            </label>`
        document.getElementById("testcase" + (new_id + 1)).id = "testcase" + new_id


        document.getElementById("expectedOutput" + (new_id + 1) + "label").id ="expectedOutput" + new_id + "label"
        document.getElementById("expectedOutput" + (new_id + 1)).id = "expectedOutput" + new_id

        new_id++;
    }

    count--;

    preview();
}


function AddNewCase() {
    count += 1;
    var htmlstr = `            
            <div class="row me-2 ms-1 mt-3" id="TestCase_${count}">
                <hr class="border-dark">
                <label id="TestCase_${count}_label" class="form-label mb-3 mt-3">
                    <strong>Test Case${count}</strong>
                </label>
                <div class="border rounded" id="testcase${count}"  style="height: 100px;"></div>
                <button class="btn btn-outline-primary col-2 mt-1" onmousedown="checkTestCase(${count})" type="button">Check</button>
                <span class="col-10 mt-3" style="font-size: 10px; color: darkgray">Hint: Press check button to get the expected output.</span>

                <label id="expectedOutput${count}label" class="form-label mb-3 mt-3">
                    <strong>Expected Output</strong>
                </label>
                <textarea class="form-control" id="expectedOutput${count}" rows="3" style="white-space: pre-line;" readonly></textarea>

                <div class="align-content-md-center w3-padding-24" style="text-align: center">
                    <input type="submit" class="btn btn-outline-success col-3" onclick="DeletePosting('TestCase_${count}')" value="Delete">
                </div>
            </div>`

    document.getElementById("TestCases").insertAdjacentHTML("beforeend", htmlstr);
    var addButton = document.getElementById("addButton");
    if (count < maxFile) {
        addButton.style.display = "block"
    } else {
        addButton.style.display = "none"
    }

    var testCaseEditor = window.monaco.editor.create(document.getElementById('testcase'+(count)), {
        value: "print(functionName(parameter1, parameter2))",
        language: document.getElementById("Language").value.toLowerCase(),
        lineNumbers: 'on',
        roundedSelection: true,
        scrollBeyondLastLine: false,
        readOnly: false,
        fixedOverflowWidgets: true,
        // theme: 'vs-dark'
    });


    preview();
}


function Posting() {
    // Error messages
    if (document.getElementById("Language").value == "Choose a Language" || document.getElementById("Language").value == "" || document.getElementById("Language").value == null) {
        document.getElementById('noLanguage').className = 'toast fade show';
        document.getElementById('noLanguage').setAttribute("class", 'toast fade show');
        document.getElementById('noLanguage').hidden = false;
        $("#noLanguage").show().delay(3000).fadeOut();
        return;
    } else if (document.getElementById("Difficulty").value == "Choose a Difficulty Level" || document.getElementById("Difficulty").value == "" || document.getElementById("Difficulty").value == null) {
        document.getElementById('noDifficulty').className = 'toast fade show';
        document.getElementById('noDifficulty').setAttribute("class", 'toast fade show');
        document.getElementById('noDifficulty').hidden = false;
        $("#noDifficulty").show().delay(3000).fadeOut();
        return;
    } else if (document.getElementById("questionTitle").value == "Choose a Language" || document.getElementById("questionTitle").value == null || document.getElementById("questionTitle").value == "" || document.getElementById("questionTitle").value == " ") {
        document.getElementById('noTitle').className = 'toast fade show';
        document.getElementById('noTitle').setAttribute("class", 'toast fade show');
        document.getElementById('noTitle').hidden = false;
        $("#noTitle").show().delay(3000).fadeOut();
        return;
    } else if (document.getElementById("functionName").value == "" || document.getElementById("functionName").value == null || document.getElementById("functionName").value == " ") {
        document.getElementById('noFunctionName').className = 'toast fade show';
        document.getElementById('noFunctionName').setAttribute("class", 'toast fade show');
        document.getElementById('noFunctionName').hidden = false;
        $("#noFunctionName").show().delay(3000).fadeOut();
        return;
    } else if (document.getElementById("Description").value == "" || document.getElementById("Description").value == null || document.getElementById("Description").value == " ") {
        document.getElementById('noDescription').className = 'toast fade show';
        document.getElementById('noDescription').setAttribute("class", 'toast fade show');
        document.getElementById('noDescription').hidden = false;
        $("#noDescription").show().delay(3000).fadeOut();
        return;
    }else if(monaco.editor.getModels()[0].getValue() == "" || monaco.editor.getModels()[0].getValue() == null || monaco.editor.getModels()[0].getValue() == "def function():" || monaco.editor.getModels()[0].getValue() == " "){
        document.getElementById('noSolution').className = 'toast fade show';
        document.getElementById('noSolution').setAttribute("class", 'toast fade show');
        document.getElementById('noSolution').hidden = false;
        $("#noSolution").show().delay(3000).fadeOut();
        return;
    }
    else if(localStorage.getItem('username') == null ||localStorage.getItem('username') == '' ){
        document.getElementById('PostRequireLogin').className = 'toast fade show';
        document.getElementById('PostRequireLogin').setAttribute("class", 'toast fade show');
        document.getElementById('PostRequireLogin').hidden = false;
        $("#PostRequireLogin").show().delay(3000).fadeOut();
        document.getElementById('collapseExample').setAttribute("class", 'collapse show');
        return;
    }

    let l1 = [];
    for (var i = 1; i <= count; i++) {
        try {
            if (i <= 2) {
                if (monaco.editor.getModels()[i].getValue() == "def function():" || monaco.editor.getModels()[i].getValue() == "" || document.getElementById("expectedOutput" + i).value == "" || document.getElementById("expectedOutput" + i).value == "") {
                    document.getElementById('noTestCases').className = 'toast fade show';
                    document.getElementById('noTestCases').setAttribute("class", 'toast fade show');
                    document.getElementById('noTestCases').hidden = false;
                    $("#noTestCases").show().delay(3000).fadeOut();
                    return;
                } else {
                    l1.push(monaco.editor.getModels()[i].getValue() + "%$#");
                    l1.push(document.getElementById("expectedOutput" + i).value.replaceAll(' ','%%(spacing)').replaceAll('&nbsp;','%%(spacing)').replaceAll('\n', '%%n') + "%$#");
                }
            } else {
                if (monaco.editor.getModels()[i].getValue() != "def function():" && monaco.editor.getModels()[i].getValue() != null && monaco.editor.getModels()[i].getValue() != "" && document.getElementById("expectedOutput" + i).value != "" && document.getElementById("expectedOutput" + i).value != null) {
                    l1.push(monaco.editor.getModels()[i].getValue() + "%$#");
                    l1.push(document.getElementById("expectedOutput" + i).value.replaceAll('&nbsp','%%(spacing)').replaceAll(' ','%%(spacing)').replaceAll('\n', '%%n') + "%$#");
                } else {
                    document.getElementById('noParingTestCases').className = 'toast fade show';
                    document.getElementById('noParingTestCases').setAttribute("class", 'toast fade show');
                    document.getElementById('noParingTestCases').hidden = false;
                    $("#noParingTestCases").show().delay(3000).fadeOut();
                    return;
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
    var tags = document.getElementById("Language").value + ',' + document.getElementById("Difficulty").value;
    if (document.getElementById("Category").value != "" && document.getElementById("Category").value != "Choose a Category" && document.getElementById("Category").value != null) {
        tags += ',' + document.getElementById("Category").value;
    }

    let question = {
        "questionTitle": document.getElementById("questionTitle").value,
        "description": document.getElementById("Description").value.replaceAll('\n', '<br>'),
        "testCase": `${l1}`,
        "tags": tags,
        "runMethod": document.getElementById("functionName").value,
        "sampleSolution": monaco.editor.getModels()[0].getValue(),
        "Difficulty_level": document.getElementById("Difficulty").value,
    }
    console.log(question)

    var base64encodedData = btoa(localStorage.getItem("username") + ":" + localStorage.getItem("password"));

    if (base64encodedData != "") {
        fetch("http://192.168.31.77:5050/question/AddQuestion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + base64encodedData,
            },
            body: JSON.stringify(question)
        })
            .then(res => res.status.toString())
            .then(data => {
                if (data == "200") {
                    document.getElementById('postSuccess').className = 'toast fade show';
                    document.getElementById('postSuccess').setAttribute("class", 'toast fade show');
                    document.getElementById('postSuccess').hidden = false;
                    $("#postSuccess").show().delay(3000).fadeOut();
                    setTimeout(function () {
                        window.location.reload();
                    }, 3000);
                }
            })
    }
}

function preview() {
    let testcases = [];
    for (let i = 0; i < 2 * count; i++) {
        if (i%2 == 0){
            testcases.push("Test case " + (Math.floor(i/2)+1));
        }else{
            testcases.push("Expected output " + (Math.ceil(i/2)));
        }
    }

    // test case1: monaco.editor.getModels()[1].getValue()
    // test case2: monaco.editor.getModels()[2].getValue()
    for (var i = 0; i < count; i++) {
        try {
            if (monaco.editor.getModels()[(i+1)].getValue() != "print(functionName(parameter1, parameter2))") {
                testcases[i * 2] = monaco.editor.getModels()[(i+1)].getValue()
            }
            if (document.getElementById("expectedOutput" + (i + 1)).value != "") {
                testcases[i * 2 + 1] = document.getElementById("expectedOutput" + (i + 1)).value
            }
        } catch (e) {
            console.log(e)
        }
    }


    //set language
    if (document.getElementById("Language").value != "Choose a Language") {
        $("#languageTag").attr("class", "btn btn-" + colors_dict[document.getElementById("Language").value]);
        $("#languageTag").html(document.getElementById("Language").value);

    } else {
        $("#languageTag").attr("class", "btn btn-dark");
        $("#languageTag").html("Language");
    }

    //set difficulty
    if (document.getElementById("Difficulty").value != "Choose a Difficulty Level") {
        $("#difficulty_level").attr("class", "btn btn-" + colors_dict[document.getElementById("Difficulty").value]);
        $("#difficulty_level").html(document.getElementById("Difficulty").value);
    } else {
        $("#difficulty_level").attr("class", "btn btn-dark");
        $("#difficulty_level").html("Difficulty");
    }

    //set category
    if (document.getElementById("Category").value != "Choose a Category") {
        $("#categoryTag").attr("class", "btn btn-" + colors_dict[document.getElementById("Category").value]);
        $("#categoryTag").html(document.getElementById("Category").value);
        document.getElementById('categoryTag').hidden = false;
    } else {
        document.getElementById('categoryTag').hidden = true;
    }

    //set question title
    if (document.getElementById("questionTitle").value != "" && document.getElementById("questionTitle").value != null && document.getElementById("questionTitle").value != " ") {
        $("#quesTitle").html(document.getElementById("questionTitle").value);
    } else {
        $("#quesTitle").html("Question Title");
    }
    //set function name
    if (document.getElementById("functionName").value != "" && document.getElementById("functionName").value != null && document.getElementById("functionName").value != " ") {
        $("#funcDes").html(document.getElementById("functionName").value);
    } else {
        $("#funcDes").html('<code class="bg-light rounded-3">functionName(parameter1, ...)</code>');
    }
    //set question description
    if (document.getElementById("Description").value != "" && document.getElementById("Description").value != null && document.getElementById("Description").value != " ") {
        $("#quesDes").html(document.getElementById("Description").value.replaceAll('\n', '<br>'));
    } else {
        $("#quesDes").html("Question description");
    }
    //set sample solution
    $("#solution_example").html("") //clear the div
    if (monaco.editor.getModels()[0].getValue() != "") {
        $("#solution_example").append(
            '<div class="bg-light rounded-3 example" style="height: auto" id="sampleSolution"></div>'
        )
        let result = monaco.editor.getModels()[0].getValue();
        //$("#solution_example").html("<code>" + result.replaceAll("\t", "&nbsp&nbsp&nbsp&nbsp") + "</code>");

        let editorSample = ace.edit("sampleSolution")
        //editor.setTheme("ace/theme/github")
        editorSample.session.setMode(`ace/mode/python`)
        editorSample.setOptions({
            autoScrollEditorIntoView: true,
            copyWithEmptySelection: true,
            mergeUndoDeltas: "always",
            animatedScroll: true,
            readOnly:true,
            fontSize: 15,
            maxLines: 10,
        })
        editorSample.insert(result);
    } else {
        document.getElementById("solution_example").innerHTML = '<div class="bg-light rounded-3 example"><code>sample solution</code></div>';
    }

    //set testcases
    $("#testcase").html("") //clear the div
    for (let i = 0; i < testcases.length; i++) {
        if (i % 2 === 0) {
            $("#testcase").append(
                "<h4 class='mb-2'>Test Case " + (Math.ceil(i / 2) + 1) + ':</h4> <div class="bg-light rounded-3 example" style="white-space: pre-line;" id="ace'+ i +'"></div><br>'
            )
            let editor = ace.edit("ace"+i)
            //editor.setTheme("ace/theme/github")
            editor.session.setMode(`ace/mode/python`)
            editor.setOptions({
                autoScrollEditorIntoView: true,
                copyWithEmptySelection: true,
                mergeUndoDeltas: "always",
                animatedScroll: true,
                readOnly:true,
                fontSize: 15,
                maxLines: 5,
            })
            editor.insert(testcases[i])
        } else {
            $("#testcase").append(
                "<h4 class='mb-2'>Expected Output " + (Math.ceil(i / 2)) + ':</h4> <div class="bg-light rounded-3 example" style="white-space: pre-line;">'+ testcases[i] +'</div><br>'
            )
        }
    }
}

function checkTestCase(caseNumber){
    var sampleSoulution = monaco.editor.getModels()[0].getValue();
    var testCase = monaco.editor.getModels()[caseNumber].getValue()
    $.ajax({
        url: "http://192.168.31.77:4000/jobe/index.php/" +
            "" +
            "" +
            "/runs",  //登录的接口URL
        dataType: "json",
        data: {
            run_spec: {
                "language_id": "python3",
                "sourcefilename": "test.py",
                "sourcecode": sampleSoulution + '\n' + testCase
            }
        },
        type: 'post', //post类型
        headers: {
            Accept: "application/json; charset=utf-8"
        },
        success: function (resp) {
            if (resp.stdout !== "" && resp.cmpinfo === "" && resp.stderr === "") {
                document.getElementById('expectedOutput'+caseNumber).innerHTML = resp.stdout.replaceAll(" ", "&nbsp");
            }else if (resp.stdout === "" && resp.cmpinfo !== "" && resp.stderr === "") {
                document.getElementById('expectedOutput'+caseNumber).innerHTML = resp.cmpinfo.replaceAll(" ", "&nbsp");
            }else if (resp.stdout === "" && resp.cmpinfo === "" && resp.stderr !== "") {
                document.getElementById('expectedOutput'+caseNumber).innerHTML = resp.stderr.replaceAll(" ", "&nbsp");
            }else{
                document.getElementById('expectedOutput'+caseNumber).innerHTML = resp.stderr.replaceAll(" ", "&nbsp");
            }
            preview();
        }
    });
}