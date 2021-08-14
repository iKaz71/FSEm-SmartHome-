var express = require("express");
var app = express();

var WSserver = require("ws").Server;
var wss = new WSserver({ port : 31337 });
var pwm = 0;
var Gpio =require('pigpio').Gpio;


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
wss.on("connection", function(ws) {

    console.log("Se recibio una nueva conexion");
    level=1;
   
    ws.send(JSON.stringify({pwm:pwm, btn: level}));
    button.on('alert', (level, tick) => {
        if (level === 1) {
            ws.send(JSON.stringify({btn: level}));
        }
        else if(level === 0){
            ws.send(JSON.stringify({btn: level}));
        }
    });
    
    

    ws.on("message", function(message) {
        var obj = JSON.parse(message);

        if("led" in obj) {
            
            if(obj.led === 1)
                led.digitalWrite(1);
            else
                led.digitalWrite(0);
        }
        
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
        
        
        

        if("pwm" in obj) {
            pwm = Number(obj.pwm);
            led2.pwmWrite(pwm);
        }
    });

    ws.on("close", function(client) {
        console.log("Conexion websocket cerrada");
    });

    ws.on("error", function(client) {
        console.log("Ha ocurrido un error");
    });
    

});


app.use(express.static('public'));
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/control.html");
});

app.use(function(req, res, next) {
    res.status(404).send("Erro 404 - Página no encontrada");
});

app.listen(80, function() {
    console.log("Servidor iniciado en el puerto 80");
});
