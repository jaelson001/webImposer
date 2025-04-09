
import impose from "./impose.js";

document.getElementById("entrada").addEventListener("change", function(e){
    var selectedFile = e.target.files;
    if (selectedFile.length > 0) {
        document.querySelector("#wrapper").innerHTML = "";
        var fileToLoad = selectedFile[0];
        console.log(selectedFile);
        var fileReader = new FileReader();

        fileReader.onload = function(e) {
            let buffer = fileReader.result;
            if(buffer.indexOf('data:application/pdf;') != -1){
                document.querySelector("#wrapper").style.display = "none";
                document.querySelector(".content").classList.remove("empty");
                impose(buffer);
            }else{
                alert("tipo de arquivo não é suportado nessa versão")
            }
            
        };
        fileReader.readAsDataURL(fileToLoad);
    }
});

document.getElementById("papel").addEventListener("change", function(e){
    document.querySelector("#wrapper").innerHTML = "";
    document.querySelector("#wrapper").style.display = "none";
    document.querySelector(".content").classList.add("empty");
});
