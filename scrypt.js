var image = new Image();
image.onload = imageLoaded;
image.src = "yo.jpeg";

function imageLoaded(){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image,0,0,image.width,image.height);

    blancoYNegro(canvas);
}

function blancoYNegro(canvas){
    var ctx = canvas.getContext("2d");
    var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
    console.log(imgData)
}