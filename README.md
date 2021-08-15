# FSEm-SmartHome-
Concentrador Smarthome es un sistema embebido desarrollado en Python 3 para Raspberry Pi 3. 
- Abrir y cerrar el Garaje
- Encendido de luces
- Atenuacion de la luz
- Programación de encendido y apagado de luces
- Alerta de Timbre
- Desplegado de Camaras de Seguridad
 
## Autores
- Gaytan Medina Gabriela
- Omar Hernández Francisco
- Santos Escobar Christian Alexis
  
  
### Instalación
Se necesita de Python 3 para su correcto funcionamiento
Para poder hacer uso del programa SmartHome es necesario hacer la instalacion de algunos paquetes.

En primer actualice la lista de paquetes de su sistema:
```sh
$ sudo apt-get update
```
Actualice todos sus paquetes instalados a su ultima version:
```sh
 $ sudo apt-get dist-upgrade
```
Ahora procedemos a descargar e instalar la version mas reciente de Nodejs, para ello usaremos el siguiente comando
```sh
 $ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
 ```
Ahora procedemos a instalarlo
```sh
 $ sudo apt-get install -y nodejs
```
Ahora verifiquemos que la instalacio fue exitosa con la siguiente linea
```sh
 node -v
```
Ahora deberemos instalar la biblioteca de pigpio con los siguientes comandos:
```sh
$ sudo apt-get install pigpio
``````
Ahora procedemos a instalar un gestor de paquetes para nodejs, el cual posteriormente nos
permitira instalar otros paquetes para usar los pines Gpio y el uso de sockets
```sh
 npm install -g npm
```
Teniendo correctamente instalado npm ahora procedemos con la instalacion de express:
```sh
npm install pigpio
```
Teniendo correctamente instalado npm ahora procedemos con la instalacion de express:
```sh
 npm install express --save
```
Ahora por ultimo haremos la instalacion de websocket para ello usaremos el siguiente comando:
```sh
 npm install ws --save
```

Esto es para las camaras de seguridad
```sh
$ sudo apt-get install motion
```
Editamos los siguientes parametros 
```sh
$ sudo nano /etc/motion/motion.conf
```

- daemon ON
- image width 320
- image height 240
- stream_port 8081
- stream:localhost off
- webcontrol_port 8888
- webcontrol_localhost off

Editamos el siguiente
```sh
sudo nano /etc/default/motion
```
- start_motion_daemon YES

```sh
$ sudo motion
```

Ahora nos posicionamos en la carpeta donde hemos descargado los archivos y ejecutamos el programa 
como usuario root:
```sh
$ sudo nodejs app.js
```

pudes acceder de manera remota conectado a la misma utilizando la ip del raspberry

# interfaz en movil 
![1](/img/1.png)![2](/img/2.png)

Video en Youtube
https://youtu.be/Mn9w4tbmyQY

License
----

MIT
