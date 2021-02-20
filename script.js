function request(reqContent){
    // let server = "http://localhost/";
    return new Promise(function(resolve, reject){

        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                resolve(this.responseText)
            }
        }
        xmlhttp.open("GET", reqContent, true);
        xmlhttp.send();
    })
}

window.addEventListener("DOMContentLoaded", (event) => {
    let ok = "http://localhost:8080/?token=123&guild=718471398426673252&channel=718471398938509332&msg=807665330671059002";
      request(ok).then((value) => {
        document.getElementsByTagName("textarea")[0].innerHTML = value;
      });
    console.log("loaded")
});

document.getElementsByTagName("textarea")[0].addEventListener("input", function(event){
    // document.getElementsByClassName("right")[0].innerHTML += document.getElementsByClassName("right")[0].value.replace("**", "<b>")
    let content = document.getElementsByTagName("textarea")[0].value;
    content = changeChar("**", "<b>", "</b>", content);
    content = changeChar("*", "<i>", "</i>", content);
    content = changeChar("__", "<u>", "</u>", content);
    content = content.replaceAll(/\n/g, '<br>\n');
    content = changeChar("```", "<code class='hljs'>", "</code>", content)
    content = changeChar("``", "<code class='inline'>", "</code>", content)

    document.getElementsByClassName("save")[0].classList.remove("disabled");
    document.getElementsByClassName("save")[0].style.display = "inline-block";
    document.getElementsByClassName("save")[0].disabled = false;

    document.getElementsByClassName("right")[0].innerHTML = content;
})

function changeChar(from, to, to2, string){
    for(let k = 0; k < string.split(from).length; k++){
        if(k%2 == 0){
            string = string.replace(from, to);
        }else{
            string = string.replace(from, to2);
        }
    }
    console.log(string)
    return string;
}

document.getElementsByClassName("save")[0].addEventListener("click", function(){
    let content = document.getElementsByTagName("textarea")[0].value;
    document.getElementsByClassName("save")[0].disabled = true;
    document.getElementsByClassName("save")[0].classList.add("disabled");
    content = content.replaceAll(/\n/g, '\n');
    content = encodeURIComponent(content);
    let ok = "http://localhost:8080/modif/?token=123&guild=718471398426673252&channel=718471398938509332&msg=807665330671059002&content="+content;
    request(ok).then((value) => {
        if(value == "good"){
            document.getElementsByClassName("save")[0].style.display = "none";
        }else{
            document.getElementsByClassName("save")[0].classList.remove("disabled");
            document.getElementsByClassName("save")[0].disabled = false;

        }
      });
    console.log("loaded")
})