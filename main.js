/// <reference path="https://cdn.babylonjs.com/babylon.js">

//import * as BABYLON from "https://preview.babylonjs.com/babylon.js";
//SSD Paper 2016 https://arxiv.org/pdf/1512.02325.pdf

class BasicWorldDemo {
    constructor() {
      this._Initialize();
    }
  
    _Initialize() {
        
        window.addEventListener('resize', () => {
            this._OnWindowResize();
          }, false);

        console.log("hello Babylon.js Canvases")
        const canvas = document.createElement('canvas') //notice this is a create element
        const canvasFollow = document.getElementById('renderCanvas0')
        this.canvasPov = document.getElementById('renderCanvas1')
        this.canvas2D = document.getElementById('renderCanvas3')
        this.canvas2D.width = this.canvasPov.width
        this.canvas2D.height = this.canvasPov.height
        this.children = [];//used for adding highlights
        
        // Load the model.
        // this.model = cocoSsd.load().then(model=>{
        //     console.log('Model is loaded', model.detect(this.canvasPov))
        //     //this._RAF();
        // });
          // counter for testing
          this.num = 0;
          //Load the model.
            cocoSsd.load().then(model=>{
                this.model = model
                console.log('Model loaded calling detect')
                console.log(this.model)
                //this._detect(model)
                
                this._RAF()
            
            });

            // model => {
            //     //detect objects in the image.
            //     model.detect(canvas2D).then(predictions => {
            //     console.log('Predictions: ', predictions);
            //     });

        // Classify the image.
        //const predictions =  model.detect('renderCanvas1');

        //var canvas = document.getElementById('viewport'),
        //code to text coco
            // let context = this.canvas2D.getContext('2d');

            //_make_base(){
                // let base_image = new Image();
                // base_image.src = 'cat.jpeg';
                // base_image.onload = function(){
                //     context.drawImage(base_image, 0, 0);
                // }
            //}

        

        //var c = document.createElement('renderCanvas1') 
        this._ctx = this.canvasPov.getContext("2d");
        this._ctx.globalAlpha = 0.3;
        this._ctx.fillStyle = "rgba(0,255,0,.4)"
        this._ctx.beginPath();
        this._ctx.fillRect(20, 20, 150, 100);
        this._ctx.strokeStyle = "rgba(81,255,13,.5)";
        this._ctx.fillStyle = 'green' //"rgba(81,255,13,0)"
        this._ctx.font = 'bold 90px Arial';
        //this._ctx.fillText('Hello world', 20, 20);

        this._engine = new BABYLON.Engine(canvas,true);

        // Set the default canvas to use for events
        this._engine.inputElement = canvasFollow;

        // This creates a basic Babylon Scene object (non-mesh)
        this._scene = new BABYLON.Scene(this._engine);
        
        
        // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
        this._sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, this._scene);
        this._sphere.position.y = 5;
        console.log(this._sphere.position)

        const box3 = BABYLON.MeshBuilder.CreateBox("sphere", {width: 1, height:1, depth: 2}, this._scene);
        box3.position.y = 1;

        const cone = BABYLON.MeshBuilder.CreateCylinder("cone", {diameterTop: 0, diameterBottom: 1, height: 1.5}, this._scene);
        const box2 = BABYLON.MeshBuilder.CreateBox("box", {height: 0.7, depth: 0.5, width: 0.2}, this._scene)
        box2.position.z = -0.5;
        box2.position.y = -0.35;
        const enemy = BABYLON.Mesh.MergeMeshes([cone, box2]);

        enemy.position.x  = this._sphere.position.x;
        enemy.position.y = this._sphere.position.y;
        enemy.position.z = this._sphere.position.x;


        let size = 6;
        // X
       	var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
		new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
		new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
		], this._scene);
        axisX.color = new BABYLON.Color3(1, 0, 0);
        var xChar = makeTextPlane("X", "red", size / 10, this._scene);
        xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
        axisX.parent = box3;
        
        // Y
        var axisY = BABYLON.Mesh.CreateLines("axisY", [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
            new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
            ], this._scene);
        axisY.color = new BABYLON.Color3(0, 1, 0);
        var yChar = makeTextPlane("Y", "green", size / 10, this._scene);
        yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
        axisY.parent = box3;

        // Z
        var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
            new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
            ], this._scene);
        axisZ.color = new BABYLON.Color3(0, 0, 1);
        var zChar = makeTextPlane("Z", "blue", size / 10,this._scene);
        zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
        axisZ.parent = box3;

        function makeTextPlane(text, color, size, scene) {
            var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
            dynamicTexture.hasAlpha = true;
            dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
            var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
            plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
            plane.material.backFaceCulling = false;
            plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
            plane.material.diffuseTexture = dynamicTexture;
            return plane;
        }

        //code from SimonDev
        // for (let x = -8; x < 8; x++) {
        //     for (let y = -8; y < 8; y++) {
        //       const box = new THREE.Mesh(
        //         new THREE.BoxGeometry(2, 2, 2),
        //         new THREE.MeshStandardMaterial({
        //             color: 0x808080,
        //         }));
        //       box.position.set(Math.random() + x * 5, Math.random() * 4.0 + 2.0, Math.random() + y * 5);
        //       box.castShadow = true;
        //       box.receiveShadow = true;
        //       this._scene.add(box);
        //     }
        //   }

        //   for (let x = -8; x < 8; x++) {
        //     for (let y = -8; y < 8; y++) {
        //       var box = new BABYLON.Mesh.CreateBox("box",'2',this._scene);
        //         box.position.x = Math.random() + x * 5;
        //         box.position.y = Math.random() * 8.0 + 2.0;
        //         box.position.z = Math.random() + y * 5;
        //         var boxMaterial = new BABYLON.StandardMaterial("material", this._scene);
        //         boxMaterial.emissiveColor = new BABYLON.Color3(0, Math.random(), Math.random());//new BABYLON.Color3(0, 0.58, 0.86);
        //         box.material = boxMaterial;
        //         this._shadowGenerator.getShadowMap().renderList.push(box)
        //     }
        //   }

        

        // this._box = BABYLON.Mesh.CreateBox("box", '2', this._scene);	
        // this._box.position.y = 3;
        // this._box.position.z = 5;
        // var boxMaterial = new BABYLON.StandardMaterial("material", this._scene);
        // boxMaterial.emissiveColor = new BABYLON.Color3(0, 0.58, 0.86);
        // this._box.material = boxMaterial;
        
            // scene.registerBeforeRender(function() { 
            //    pl.position = camera.position;
            // });

        // this._scene.onKeyboardObservable.add((kbInfo) => {
        //     switch (kbInfo.type) {
        //         case BABYLON.KeyboardEventTypes.KEYDOWN:
        //             switch (kbInfo.event.key) {
        //                 case "a":
        //                 case "A":
        //                     //this._sphere.rotation.y -= 0.1;
        //                     this._sphere.rotate(BABYLON.Axis.Y, -0.1, BABYLON.Space.LOCAL);
        //                 break
        //                 case "d":
        //                 case "D":
        //                     //this._sphere.rotation.y += 0.1;
        //                     this._sphere.rotate(BABYLON.Axis.Y, +0.1, BABYLON.Space.LOCAL);
        //                 break
        //                 case "w":
        //                 case "W":
        //                     this._sphere.position.z += 0.1;
        //                 break
        //                 case "s":
        //                 case "S":
        //                     this._sphere.position.z -= 0.1;
        //                 break
        //             }
        //         break;
        //     }
        // });

        // Our built-in 'sphere' shape.
    

    // Our built-in 'ground' shape.
    //var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    // Player Controller sandbox example
    //https://playground.babylonjs.com/#9PD18T
    //
    //
    const input = {
        forward:false,
        backward:false,
        left:false,
        right:false
    }
    this._scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                //console.log("KEY DOWN: ", kbInfo.event.key);
                switch (kbInfo.event.key) {
                    case 'w':
                        //console.log("KEY DOWN: ", kbInfo.event.key);
                        input.forward = true;
                        break;
                    case 's':
                        input.backward = true;
                        break;
                    case 'a':
                        input.left = true;
                        break;  
                    case 'd':
                        input.right = true;
                        break;       
                }
                break;
            case BABYLON.KeyboardEventTypes.KEYUP:
                switch (kbInfo.event.key) {
                    case 'w':
                        //console.log("KEY DOWN: ", kbInfo.event.key);
                        input.forward = false;
                        break;
                    case 's':
                        input.backward = false;
                        break;
                    case 'a':
                        input.left = false;
                        break;  
                    case 'd':
                        input.right = false;
                        break;     
                }
                break;
        }
    });
    let delta = 0;
    const linearSpeed = 10;
    const angularSpeed = 2;
    const translation = new BABYLON.Vector3(0,0,0);
    const rotation = new BABYLON.Vector3(0,0,0);
    this._scene.registerBeforeRender((e)=>{
        delta = e.deltaTime ? e.deltaTime/1000 : 0;
        translation.set(0,0,0);
        rotation.set(0,0,0);
        if(input.forward){
            translation.z = linearSpeed*delta;
        }
        if(input.backward){
            translation.z = -linearSpeed*delta;
        }
        if(input.left){
            rotation.y = -angularSpeed*delta;
        }
        if(input.right){
            rotation.y = angularSpeed*delta;
        }
        box3.rotation.y += rotation.y;
        box3.locallyTranslate(translation)
        //BABYLON.Vector3.TransformNormalToRef(translation,box.getWorldMatrix(),translation);
        //box.position.addInPlace(translation);
    })

        //Universal Camera attempt
        //scene.createDefaultCameraOrLight(1, 1, 1);
        // this._camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0, 5, -10), this._scene);
        // this._camera.setTarget(BABYLON.Vector3.Zero());
        //this._camera.attachControl(canvasFollow, true);

        //Follow Camera attempt
        //this._camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(-6, 0, 0), this._aaascene);
        this._camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 10, -10), this._scene);
        //this._camera.setPosition(new BABYLON.Vector3(0, 200, -30));
        this._camera.heightOffset = 8;
        this._camera.radius = 1;
        this._camera.rotationOffset = 0;
        this._camera.cameraAcceleration = 0.005;
        this._camera.maxCameraSpeed = 10;
        this._camera.attachControl(canvasFollow);
        this._camera.lockedTarget = box3;

        this._camera1 = new BABYLON.UniversalCamera("Camera1",box3.position, this._scene); //new BABYLON.Vector3(0, .5, -1)
        // Set the camera's parent to mesh so it will continue to look at it. new BABYLON.Vector3(0, 5, -20)
        this._camera1.parent = box3;  //BABYLON.Vector3.Zero()
        this._camera.attachControl(this.canvasPov);
        
        
    
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        //scene.lights[0].dispose();
        this._light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-1, -3, 1), this._scene);
        this._light.position = new BABYLON.Vector3(3, 9, 3);

        this._light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this._scene);
        this._light1.intensity = 0.2;

        this._shadowGenerator = new BABYLON.ShadowGenerator(1024, this._light);
        this._shadowGenerator.getShadowMap().renderList.push(this._sphere)
        this._shadowGenerator.getShadowMap().renderList.push(this._box)
        this._shadowGenerator.getShadowMap().renderList.push(box3)

        //const shadowGenerator = new BABYLON.ShadowGenerator(1024, this._light1);

        // for (let x = -8; x < 8; x++) {
        //     for (let y = -8; y < 8; y++) {
        //       var box = new BABYLON.Mesh.CreateBox("box",'2',this._scene);
        //         box.position.x = Math.random() + x * 5;
        //         box.position.y = Math.random() * 8.0 + 2.0;
        //         box.position.z = Math.random() + y * 5;
        //         var boxMaterial = new BABYLON.StandardMaterial("material", this._scene);
        //         boxMaterial.emissiveColor = new BABYLON.Color3(0, Math.random(), Math.random());//new BABYLON.Color3(0, 0.58, 0.86);
        //         box.material = boxMaterial;
        //         this._shadowGenerator.getShadowMap().renderList.push(box)
        //     }
        //   }
    
        // Default intensity is 1. Let's dim the light a small amount
        this._light.intensity = 0.7;

        //Create a ground plain
        this._ground = BABYLON.Mesh.CreateGround("ground1", 50, 50, 2, this._scene);

        this._ground.receiveShadows = true;
    
        this._skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 500, this._scene, undefined, BABYLON.Mesh.BACKSIDE);
        this._skybox.infinityDistance = true;
        //Create and tweak the background material.
        this.backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", this._scene);
        //var backgroundMaterial = new BABYLON.BackgroundMaterial("negx.jpg", scene);
        this.backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("./textures/des", this._scene);
        this.backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        this._skybox.material = this.backgroundMaterial;

        //this._axis = new AxisArrows(this._scene,6, BABYLON.Vector3.Zero, null);

        this._LoadMesh();
    

        this._engine.registerView(canvasFollow);
        this._engine.registerView(this.canvasPov, this._camera1);

        
    
        // this._RAF();

            //})
    }
    
    _OnWindowResize(){
        this._engine.resize();
    }

    _RAF(){
        // requestAnimationFrame(() => {
        // this._threejs.render(this._scene, this._camera);
        // this._RAF();
        // });
        this._engine.runRenderLoop(() => {
            if(this._scene.activeCamera){
                this._scene.render();
                //this._writeText();
                this._detect(this.model)
            }
        })
    
    }



    _writeText(predictions){

        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
          }

          for (let n = 0; n < predictions.length; n++) {
            //console.log('Predictions: ', predictions[n].class, predictions[n].bbox, predictions[n].score);
            if(predictions[n].score > 0.66){
                
          
                //this._ctx.clearRect(0,0,400,400)
                //let xx = getRandomInt(20)
                //let yy = getRandomInt(20)
                // let xx = parseInt(predictions[n].bbox[0]);
                // let yy = parseInt(predictions[n].bbox[1]);
                // this._ctx.strokeRect(xx, yy, 20, 20);
                let bbox = predictions[n].bbox;
                let x = parseInt(bbox[0]);
                let y = parseInt(bbox[1]);
                let w = parseInt(bbox[2]);
                let h = parseInt(bbox[3]);
                //this._ctx.fillStyle = "rgba(0,0,0,.9)"
                
                
                
                let font = 'bold 30px Arial'
                this._ctx.font = font;
                //"rgba(81,255,13,0)"
                // this._ctx.fillStyle = "rgba(0,255,0,.4)"
                // this._ctx.fill();
                /// get width of text
                let txt = predictions[n].class + " :" + predictions[n].score.toFixed(2);
                let width = this._ctx.measureText(txt).width;
                this._ctx.fillStyle = "rgba(0,255,0,.4)"
                /// draw background rect assuming height of font
                this._ctx.fillRect(x-10, y-60, width+20, 40);
                //this._ctx.fillRect(x, y, 20, 30);
                this._ctx.fillStyle = "rgba(81,255,13,.8)" //"rgba(0,255,0,.4)"
                this._ctx.fillText(txt, x, y-30);
                
                
                //   console.log('box x:',x)
                //   console.log('box y:',y)
                //   console.log('box w:',w)
                //   console.log('box h:',h)
                this._ctx.strokeStyle = "rgba(0,255,0,.4)"
                this._ctx.lineWidth = 10;
                this._ctx.strokeRect(x,y,w,h);
                this._ctx.fillStyle = "rgba(0,255,0,.4)"
                //this._ctx.fillRect(x,y - 60,w,30)
            }    
          }//end of for
          
    }

    _LoadMesh(){
        // The first parameter can be used to specify which mesh to import. Here we import all meshes
        BABYLON.SceneLoader.ImportMesh("", "cat/", "scene.gltf", this._scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        newMeshes[0].position.x = 1
        newMeshes[0].position.y = .25
        newMeshes[0].position.z = 1
        newMeshes[0].scaling.x = .25
        newMeshes[0].scaling.y = .25
        newMeshes[0].scaling.z = .25
        //this._shadowGenerator.getShadowMap().renderList.push(newMeshes[0])
        //shadowGenerator.addShadowCaster(newMeshes[0]);
    });

    }

    //coco detection
    _detect(m){
        //console.log('made it to _detect. now doing some stuff')
        
        m.detect(this.canvasPov).then(predictions => {
            //console.log('Predictions: ', predictions[0].class, predictions[0].bbox, predictions[0].score);
            let v = predictions[0].class;
            // console.log("canvas wh", this.canvasPov.width,this.canvasPov.height)
            // console.log("canvas2d wh", this.canvas2D.width,this.canvas2D.height)
            //if(predictions[0].score > 0.6){
                
                this._writeText(predictions)
                //}
            })
            .catch(error => {
            
            });
        }

    

    // predictWebcam() {
    // // Now let's start classifying a frame in the stream.
    // model.detect(video).then(function (predictions) {
    //     // Remove any highlighting we did previous frame.
    //     for (let i = 0; i < children.length; i++) {
    //     this.canvasPov.removeChild(this.children[i]);
    //     }
    //     this.children.splice(0);
        
    //     // Now lets loop through predictions and draw them to the live view if
    //     // they have a high confidence score.
    //     for (let n = 0; n < predictions.length; n++) {
    //     // If we are over 66% sure we are sure we classified it right, draw it!
    //         if (predictions[n].score > 0.66) {
    //             const p = document.createElement('p');
    //             p.innerText = predictions[n].class  + ' - with ' 
    //                 + Math.round(parseFloat(predictions[n].score) * 100) 
    //                 + '% confidence.';
    //             p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
    //                 + (predictions[n].bbox[1] - 10) + 'px; width: ' 
    //                 + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

    //             const highlighter = document.createElement('div');
    //             highlighter.setAttribute('class', 'highlighter');
    //             highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
    //                 + predictions[n].bbox[1] + 'px; width: ' 
    //                 + predictions[n].bbox[2] + 'px; height: '
    //                 + predictions[n].bbox[3] + 'px;';

    //             this.canvasPov.appendChild(highlighter);
    //             this.canvasPov.appendChild(p);
    //             children.push(highlighter);
    //             children.push(p);
    //         }
    //     }

    }

// class AxisArrows{
    
//     constructor(scene,size,position,parent){
//     /***********Create and Draw Axes**************************************/
//     console.log('Makeing an axis');
	
// 		var makeTextPlane = function(text, color, size) {
// 		var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
// 		dynamicTexture.hasAlpha = true;
// 		dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
// 		var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
// 		plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
// 		plane.material.backFaceCulling = false;
// 		plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
// 		plane.material.diffuseTexture = dynamicTexture;
  
// 	var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
// 		new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
// 		new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
// 		], scene);
// 	axisX.color = new BABYLON.Color3(1, 0, 0);
// 	var xChar = makeTextPlane("X", "red", size / 10);
// 	xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
//     var axisY = BABYLON.Mesh.CreateLines("axisY", [
//         new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
//         new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
//         ], scene);
//     axisY.color = new BABYLON.Color3(0, 1, 0);
//     var yChar = makeTextPlane("Y", "green", size / 10);
//     yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
//     var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
//         new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
//         new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
//         ], scene);
//     axisZ.color = new BABYLON.Color3(0, 0, 1);
//     var zChar = makeTextPlane("Z", "blue", size / 10);
//     zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
// 	};

//     }
// }//end of AxisArrow class

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('renderCanvas0').click();
    console.log("DOM content is loaded!!")
    _APP = new BasicWorldDemo();
}); 

const status = document.getElementById('status');
if (status) {
  status.innerText = 'Loaded TensorFlow.js - version: ' + tf.version.tfjs;
}