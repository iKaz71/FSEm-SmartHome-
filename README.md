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

node js
packeteria sokets
Gpio

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
sudo motion
```


