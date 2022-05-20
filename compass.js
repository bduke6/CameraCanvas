

// //var canvas = document.getElementById("canvas");
const canvs = document.getElementById('canvas');
addKeyboardListeners();
let ccx = canvs.width/2
let ccy = canvs.height/2

const ctx = canvs.getContext('2d');

 ctx.strokeStyle = 'white'; //'rgba(81,255,13,.5)';
 ctx.lineWidth = 7;
 ctx.stroke();
 ctx.font = 'bold 36px Arial'


let degrees = 0

document.getElementById("myRange").style.width = canvs.width+'px';
var slider = document.getElementById("myRange");

let oldvalue = 360
let heading = 0
let wp = 0;

function addKeyboardListeners(){
    
    document.onkeydown=(event)=>{
        switch(event.key){
            case 'x':
                wp += Math.PI/180;
                updateCompass(degrees,wp)
                break;
            case 'z':
                wp -= Math.PI/180;
                updateCompass(degrees,wp)
                break;
        }   
    }
 }



// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    changeHeading(slider.value)
}

function changeHeading(newValue){
   
    
    if(oldvalue > newValue){
       degrees -= oldvalue - newValue; 
       //console.log("Turning Left compass decreasing")
    }
    else if(oldvalue < newValue)
    {
        degrees += newValue - oldvalue; 
        //console.log("Turning Right compass increasing")
    }
    else{
        //console.log("No Turn")
    }

    oldvalue = newValue;
    
    updateCompass(degrees,2*Math.PI ); //Math.PI/2.2
}


function updateCompass(degrees,wpBearing){
    ctx.clearRect(0, 0, ccx*2,ccy*2); //clear the canvas before making changes.
    heading = degrees * Math.PI/180;

    drawDigits(correctHeading(degrees).toString().padStart(3,'0')); //padStart(2, '0')
    ctx.save()
    ctx.translate(ccx,ccy)
    ctx.rotate(-heading)
    fillTextCircle("N",0,0,100,2*Math.PI, -heading);
    ctx.restore()

    ctx.save()
    ctx.translate(ccx,ccy)
    ctx.rotate(-heading)
    fillTextCircle("E",0,0,100,Math.PI/2, -heading - Math.PI);
    ctx.restore()

    ctx.save()
    ctx.translate(ccx,ccy)
    ctx.rotate(-heading)
    fillTextCircle("S",0,0,100,Math.PI, -heading);
    ctx.restore()

    ctx.save()
    ctx.translate(ccx,ccy)
    ctx.rotate(-heading)
    fillTextCircle("W",0,0,100,(3*Math.PI)/2, -heading - Math.PI);
    ctx.restore()


    for(let i = 1; i <= 12; i++) {
        let a = 360 / 12 * i
        drawRay(a)
    }
    
    drawRedArrowHead(2*Math.PI) //always points forward toward the direction of travel
    drawWhiteArrowHead(wp) //radians

}

function drawRedArrowHead(heading){

    ctx.save()
    ctx.fillStyle = 'red'; 
    ctx.strokeStyle = 'red'; 
    ctx.translate(ccx,ccy)
    ctx.rotate(heading)
    ctx.translate(0,-85)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-10, 20);
    ctx.lineTo(10, 20);
    ctx.closePath();
    ctx.stroke()
    ctx.fill()
    ctx.restore()
}

function drawWhiteArrowHead(heading){

    ctx.save()
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 4;
    ctx.translate(ccx,ccy)
    ctx.rotate(heading)
    ctx.translate(0,-78)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-5, 10);
    ctx.lineTo(5, 10);
    ctx.closePath();
    ctx.stroke()
    ctx.fill()
    ctx.restore()
}

function drawDigits(digits){

    ctx.fillStyle = 'white'
    ctx.fillText(digits, canvs.width/2 - 28, canvs.height/2 + 12)
    
}

function correctHeading(angle){

    return (angle % 360) + (angle < 0 ? 360 : 0);
}

function getDirection(angle) {
    var directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
    var index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
    return directions[index];
}

function drawRay(angle) {
    /*
    parametric form from wikipedia:
    https://en.wikipedia.org/wiki/Circle#Equations

    x,y are origin, r is radius a is angle
    x = cx + r * cos(a)
    y = cy + r * sin(a)
    */
    
    ctx.beginPath();
    ctx.lineWidth = 5;
    const rad = angle / 180 * Math.PI

    //starting point on the circumfence of the circle
    let x0 = ccx + 72 * Math.cos(rad)
    let y0 = ccy + 72 * Math.sin(rad)
    //endpoint of the stroke further outside with a length of 100
    let x1 = ccx + 85 * Math.cos(rad)
    let y1 = ccy + 85 * Math.sin(rad)

    ctx.save();
    ctx.font = 'bold 24px Arial'
    ctx.textBaseline = 'middle';
    ctx.textAlign = "center";
    ctx.rotate(0)
    
    ctx.restore();
    
    //draw from x0 to x1
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1,y1);
    ctx.strokeStyle = 'white' //'rgba(81,255,13,.5)';
    ctx.stroke(); 

  }


function drawLine(angle) {
        /*
        parametric form from wikipedia:
        https://en.wikipedia.org/wiki/Circle#Equations

        x,y are origin, r is radius a is angle
        x = cx + r * cos(a)
        y = cy + r * sin(a)
        */
        
        ctx.beginPath();
        
        ctx.lineWidth = 2;
        //thanks Radu!
        const rad = angle / 180 * Math.PI

        //250 is the center of the circly both for x & y
        //starting point on the circumfence of the circle
        let x0 = 250 + 50 * Math.cos(rad)
        let y0 = 250 + 50 * Math.sin(rad)
        //endpoint of the stroke further outside with a length of 100
        let x1 = 250 + 100 * Math.cos(rad)
        let y1 = 250 + 100 * Math.sin(rad)
        
        //draw from x0 to x1
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1,y1);
        ctx.strokeStyle = '#ff0000';
        ctx.stroke(); 
}

//CanvasRenderingContext2D.prototype.fillTextCircle = function

function fillTextCircle(text,x,y,radius,startRotation, heading){
    var numRadsPerLetter = 2*Math.PI / text.length;
    ctx.save();
    
    ctx.translate(x,y);
    ctx.rotate(startRotation);
 
    for(var i=0;i<text.length;i++){
        
        ctx.translate(0,-radius-10);
        ctx.save() //Letter Rotation
        ctx.rotate(startRotation - heading);
        ctx.textBaseline = 'middle'
        ctx.textAlign = "center";
        ctx.fillText(text[i],0,0);
        ctx.restore() // Letter rotation
        
    }
    ctx.restore();
 }

 //compass rotation

 //cardinal heading rotation around the compass road

 //text alignment