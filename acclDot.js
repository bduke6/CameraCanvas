<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Accelerometer</title>

        <style>
        .indicatorDot{
            width: 30px;
            height: 30px;
            background-color: #ffab56;
            border-radius: 50%;
            position:fixed;
        }
        .coordinateDisplay{
            width: 300px;
            height: 100px;
            background-color:blanchedalmond;
        }
        </style>
        <script>
            var px = 50; // Position x and y
            var py = 50;
            var vx = 0.0; // Velocity x and y
            var vy = 0.0;
            var updateRate = 1/60; // Sensor refresh rate

            function getAccel(){
                DeviceMotionEvent.requestPermission().then(response => {
                    if (response == 'granted') {
                    // Add a listener to get smartphone orientation 
                     // in the alpha-beta-gamma axes (units in degrees)
                     window.addEventListener('deviceorientation',(event) => {
                     // Expose each orientation angle in a more readable way
                        rotation_degrees = event.alpha;
                        frontToBack_degrees = event.beta;
                        leftToRight_degrees = event.gamma;
                
                    // Update velocity according to how tilted the phone is
                    // Since phones are narrower than they are long, double the increase to the x velocity
                        vx = vx + leftToRight_degrees * updateRate*2; 
                        vy = vy + frontToBack_degrees * updateRate;
                
                    // Update position and clip it to bounds
                        px = px + vx*.5;
                        if (px > 98 || px < 0){ 
                            px = Math.max(0, Math.min(98, px)) // Clip px between 0-98
                            vx = 0;
                        }

                        py = py + vy*.5;
                        if (py > 98 || py < 0){
                            py = Math.max(0, Math.min(98, py)) // Clip py between 0-98
                            vy = 0;
                        }
                
                    dot = document.getElementsByClassName("indicatorDot")[0]
                    dot.setAttribute('style', "left:" + (px) + "%;" + "top:" + (py) + "%;");
                                              
                    document.getElementById("yAxis").innerHTML = "Y Axis: " +py+"<br>X Axis: "+px;
                    document.getElementById("xAxis").innerHTML = "Y Axis: " +py+"<br>X Axis: "+px;

                        if(py > 67){
                            dot = document.getElementsByClassName("coordinateDisplay")[0]
                            dot.setAttribute('style', "background-color:red;");
                        } else if (py < 67 && py > 33){
                            dot = document.getElementsByClassName("coordinateDisplay")[0]
                            dot.setAttribute('style', "background-color:yellow;");
                        } else {
                            dot = document.getElementsByClassName("coordinateDisplay")[0]
                            dot.setAttribute('style', "background-color:green;");
                        }
            });
        }
    });
}
        </script>

    </head>
    <body style="background-color:lightblue;">
        <button id="accelPermsButton"  style="height:50px;" onclick="getAccel()"><h1>Get Accelerometer Permissions</h1></button>
        <div class="indicatorDot" style="left:30%; top:30%;"><p id="yAxis">b Axis</p></div>

        <div class="coordinateDisplay">
        <p id="xAxis">b Axis</p>
        </div>

    </body>
    
</html>