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

    var resultado = document.getElementById("resultado");
    convolucionar(canvas, resultado);
}

function blancoYNegro(canvas){
    var ctx = canvas.getContext("2d");
    var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
    var pixeles = imgData.data;
    
    for (var p=0; p < pixeles.length; p+=4){

        var rojo = pixeles[p];
        var verde = pixeles[p+1];
        var azul = pixeles[p+2];
        var alpha = pixeles[p+3]; 

        var gris =(rojo + verde + azul)/3;

        pixeles[p] = gris;
        pixeles[p+1] = gris;
        pixeles[p+2] = gris;
        
    }
    ctx.putImageData(imgData,0,0);
}

function convolucionar(canvasFuente, canvasDestino) {
    //Obtenemos todas las variables necesarias
    var ctxFuente = canvasFuente.getContext("2d");
    var imgDataFuente = ctxFuente.getImageData(0,0,canvasFuente.width,canvasFuente.height);
    var pixelesFuente = imgDataFuente.data;
    
    canvasDestino.width = canvasFuente.width;
    canvasDestino.height = canvasFuente.height;

    var ctxDestino = canvasDestino.getContext("2d");
    var imgDataDestino = ctxDestino.getImageData(0,0,canvasDestino.width,canvasDestino.height);
    var pixelesDestino = imgDataDestino.data;


    //Nucleo, Kernel
    // var kernel = [
    //     [-1,-1,-1],
    //     [-1,8,-1],
    //     [-1,-1,-1],
    // ];

    var sobelVertical = [
        [-1 , 0 , 1],
        [-2 , 0 , 2],
        [-1 , 0 , 1],
    ]

    var sobelHorizontal = [
        [-1 , -2 , -1],
        [0 , 0 , 0],
        [1 , 2 , 1],
    ]


    for (var y=1; y < canvasFuente.height-1; y++){
        for (var x=1; x < canvasFuente.width-1; x++){
            //posicion en el arreglo js
            
            var idx = ((y*canvasFuente.width) + x) * 4;

           var totalY = 0;
           var totalX = 0;

           for (var kernelY = 0; kernelY < 3; kernelY++){
            for (var kernelX = 0; kernelX < 3; kernelX++){
                
                totalY += sobelVertical[kernelY][kernelX]*
                pixelesFuente[((((y + (kernelY-1))*canvasFuente.width)+(x +( kernelX-1)))*4)];

                totalX += sobelHorizontal[kernelY][kernelX]*
                pixelesFuente[((((y + (kernelY-1))*canvasFuente.width)+(x +( kernelX-1)))*4)];

            }
           }

           var mag = Math.sqrt((totalX*totalX)+(totalY*totalY));

           mag = (mag < 100) ? 0 : mag; //limite threshold

           pixelesDestino[idx] = mag; //rojo
           pixelesDestino[idx+1] = mag; //verde
           pixelesDestino[idx+2] = mag; //azul
           pixelesDestino[idx+3] = 255; 
            
        }
    }

    ctxDestino.putImageData(imgDataDestino,0,0);
    
}