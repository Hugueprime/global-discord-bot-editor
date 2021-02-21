const server = "localhost";
const port = "80";

function request(reqContent){
    return new Promise(function(resolve, reject){
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            console.log(this)
            if (this.readyState == 4 && this.status == 200) {
                resolve(this.responseText)
            }else if(this.readyState == 4 && this.responseText != ""){
                alert(this.responseText)
                reject();
            }
        }
        xmlhttp.open("GET", reqContent, true);
        xmlhttp.send();
    })
}


window.addEventListener("DOMContentLoaded", (event) => {
    //request default message
    // let msg = "http://localhost:8080/?token=63edmpDS92zFLY7sL79f&guild=718471398426673252&channel=718471398938509332&msg=807665330671059002";
    //   request(msg).then((value) => {
    //     document.getElementsByTagName("textarea")[0].innerHTML = value;
    //     clean_ig();
    //   });
});

document.getElementsByTagName("textarea")[0].addEventListener("input", function(event){
    clean_ig();
    counter();
})

function clean_ig(){
    let content = document.getElementsByTagName("textarea")[0].value;
    content = content.replaceAll(/\n/g, ' <br> \n');
    content = changeChar("**", "<b>", " </b>", content);
    content = changeChar("*", "<i>", " </i>", content);
    content = changeChar("__", "<u>", " </u>", content);
    content = changeChar("```", "<code class='hljs'>", "</code>", content)
    content = changeChar("``", "<code class='inline'>", "</code>", content)
    
    content = tag(content);

    document.getElementById("save").classList.remove("disabled");
    document.getElementById("save").disabled = false;

    document.getElementsByClassName("right")[0].innerHTML = content;
}


function tag(content){
    const regexp = /(#)|(@)/g;
    const array = [...content.matchAll(regexp)];
    for(let k = array.length-1; k >= 0;k--){
        let end = content.substr(array[k]["index"], content.length).indexOf(" ");
        if(end == -1){
            end = content.length;
        }
        let pin = content.substr(array[k]["index"], end);
        content = content.replace(pin, "<span class='mention'>"+pin+"</span>")
    }
    return content;
}




function changeChar(from, to, to2, string){
    for(let k = 0; k < string.split(from).length; k++){//search all matches
        if(k%2 == 0){
            string = string.replace(from, to);
        }else{
            string = string.replace(from, to2);
        }
    }
    console.log(string)
    return string;
}

document.getElementById("save").addEventListener("click", function(){
    let content = document.getElementsByTagName("textarea")[0].value;
    onOff(false, "save")
    content = content.replaceAll(/\n/g, '\n');
    content = encodeURIComponent(content);
    let token = document.getElementById("token").value;
    let guild = document.getElementById("guild").value;
    let channel = document.getElementById("channel").value;
    let msg = document.getElementById("msg").value;
    let ok = `http://${server}:${port}/pingu/edit/?token=${token}&guild=${guild}&channel=${channel}&msg=${msg}&content=${content}`;
    request(ok).then((value) => {
        if(value != "good"){
            onOff(true, "save")
        }
    });
    console.log("loaded")
})

document.getElementById("connect").addEventListener("click", function(){
    onOff(false, "connect")
    onOff(false, "save")
    let token = document.getElementById("token").value;
    let guild = document.getElementById("guild").value;
    let channel = document.getElementById("channel").value;
    let msg = document.getElementById("msg").value;
    let reqMsg = `http://${server}:${port}/pingu/get/?token=${token}&guild=${guild}&channel=${channel}&msg=${msg}`;
    request(reqMsg).then((value) => {
        console.log(value)
        document.getElementsByTagName("textarea")[0].innerHTML = "";
        document.getElementsByTagName("textarea")[0].innerHTML = value;
        console.log("ok")
        onOff(true, "connect")
        clean_ig();
        counter();
      });
    console.log("loaded")
})

document.getElementById("channel-test").addEventListener("click", function(){

});

function counter(){
    let char = document.getElementsByTagName("textarea")[0].value.length;

    document.getElementById("char").innerText = char;
    if(parseInt(char) > 2000){
        document.getElementById("char").classList.add("danger");
        onOff(false, "save");
    }else{
        document.getElementById("char").classList.remove("danger");
        onOff(true, "save");
    }
}

function onOff(on, element){
    let elt = document.getElementById(element);
    if(elt.classList.contains("disabled") && on){
        elt.classList.remove("disabled");
    }else if(!elt.classList.contains("disabled") && !on){
        elt.classList.add("disabled");
    }
    if(elt.disabled == true && on){
        elt.disabled = false;
    }else if(elt.disabled == false && !on){
        elt.disabled = true;
    }
}
// 23
// 22
