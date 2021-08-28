//app.js
//Control SmartHome a traves de servidor web
// usando Raspberry pi 3b+
//
//License: MIT
//
//////////////////////////////////////////////



// Se cargan los modulos necesarios para el servidorpines 
var express = require("express");
var WSserver = require("ws").Server;
var Gpio =require('pigpio').Gpio;

/* creamos el objeto servidor el cual recibe el puerto al cual 
escuchara*/
var wss = new WSserver({ port : 2021 });


// creamos la aplicacion express para hacer uso de sus metodos
var app = express();

// definimos las variables a usar y configuramos los pines Gpio como entrada o salida
var pwm = 0;
var led = new Gpio(4,{mode:Gpio.OUTPUT});
const button = new Gpio(20, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_UP,
  alert: true
});
var led2 = new Gpio(17,{mode:Gpio.OUTPUT});
var ledTem = new Gpio(22,{mode:Gpio.OUTPUT});
var motIN1 = new Gpio(15,{mode:Gpio.OUTPUT});
var motIN2 = new Gpio(14,{mode:Gpio.OUTPUT});
var motE1 = new Gpio(18,{mode:Gpio.OUTPUT});


button.glitchFilter(10000);

/*se realiza la conexion y se manejan los eventos 
que se reciben de la pagina web*/
wss.on("connection", function(ws) {
    
    console.log("Se recibio una nueva conexion");
    level=1;
   
    ws.send(JSON.stringify({pwm:pwm, btn: level}));
    
    /*se detecta mediante una interrupcion cuando el boton del timbre
    ha sido presionado*/
    button.on('alert', (level, tick) => {
        if (level === 1) {
            ws.send(JSON.stringify({btn: level}));
        }
        else if(level === 0){
            ws.send(JSON.stringify({btn: level}));
        }
    });
    
    
    /*se reciben los mensajes del cliente y se ponen las salidas gpio
     en alto o bajo */
    ws.on("message", function(message) {
        var obj = JSON.parse(message);
        /*prendemos o apagamos el led*/
        if("led" in obj) {
            
            if(obj.led === 1)
                led.digitalWrite(1);
            else
                led.digitalWrite(0);
        }
        /*abrimos el garage haciendo girar el motor a la izquierda*/
        if("motIN1" in obj) {
            
            if(obj.motIN1 === 1){
                motIN1.digitalWrite(1);
                motIN2.digitalWrite(0);
                motE1.digitalWrite(1);
                var e=0;
                const moton = () =>{
                    return new Promise((resolve,reject)=>{
                        setTimeout(()=>{
                            resolve(e)
                        },2000);
                    });
                }
                moton().then((e) =>motE1.digitalWrite(e));}
            
        }
        /*cerramos el garage haciendo girar el motor a la derecha*/
        if("motIN2" in obj) {
            
            if(obj.motIN2 === 1){
                motIN1.digitalWrite(0);
                motIN2.digitalWrite(1);
                motE1.digitalWrite(1);
                var e=0;
                const moton = () =>{
                    return new Promise((resolve,reject)=>{
                        setTimeout(()=>{
                            resolve(e)
                        },2000);
                    });
                }
                moton().then((e) =>motE1.digitalWrite(e));}
            
        }
        
       
        
        /*activa las luces tras cierto tiempo indicado por el usuario*/
        if( ("hE" && "mE") in obj){
            hE=Number(obj.hE);
            mE=Number(obj.mE);
            m= mE*60000
            h=hE * 3600000
            t=m+h
            var e=1;
            const minutos = () =>{
                return new Promise((resolve,reject)=>{
                    setTimeout(()=>{
                        resolve(e)
                    },t);
                });
            }
            minutos().then((e) =>ledTem.digitalWrite(e));
        }
        /*se desactivan las luces tras cierto tiempo indicado por el usuario*/
        if( ("hA" && "mA") in obj){
            hA=Number(obj.hA);
            mA=Number(obj.mA);
            m= mA*60000
            h=hA * 3600000
            t=m+h
            var e=0;
            const minutos = () =>{
                return new Promise((resolve,reject)=>{
                    setTimeout(()=>{
                        resolve(e)
                    },t);
                });
            }
            minutos().then((e) =>ledTem.digitalWrite(e));
        }
        
        /*manejamos el control de la atenuacion haciendo uso del PWM*/

        if("pwm" in obj) {
            pwm = Number(obj.pwm);
            led2.pwmWrite(pwm);
        }
    });

    /*mandamos mensaje por consola cuando el cliente cierra la conexion*/
    ws.on("close", function(client) {
        console.log("Conexion websocket cerrada");
    });
    /*mandamos mensaje por consola cuando ocurre un eror en la conexion*/
    ws.on("error", function(client) {
        console.log("Ha ocurrido un error");
    });
    

});


app.use(express.static('public'));

/*metodo encargado de atender las solicitudes de la pagina matriz
y enviar la respuesta a traves del archivo "controls.html"*/
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/controls.html");
});

/* este metodo cacha cuando se hace una solicitud a una ruta no existente
mandando un mensaje de error*/
app.use(function(req, res, next) {
    res.status(404).send("Erro 404 - Página no encontrada");
});

// configuramos el servidor para que escuche al cliente a traves del puerto 8080
app.listen(8080, function() {
    console.log("Servidor iniciado en el puerto 8080");
});
