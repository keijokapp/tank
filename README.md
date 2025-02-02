This repository contains the software and other files used for my RC model tank. The software is built entirely using web technologies, some of which are quite uncommon or experimental.

## Hardware overview

 - WT-500S model tank (does not include power and control electronics)
 - a modern smart phone with USB-OTG support
 - Arduino Micro
 - Motor drivers
 - Power supply for smart phone, motors, and actuators (and servos in the future)

## Software

The tank is controlled via mobile network.

There's four independent roles in control network:

 - Tank - client-side app (`tank.html`)
 - Operator - client-side app (`operator.html`)
 - NodeJS server - serves static files and simple WebSocket broadcast interface
 - TURN server - might not be absolutely necessary

Experimental or uncommon web API-s used:

 - WebRTC
 - WebUSB
 - Gamepad API
 - Web Media API (cameras, audio, flashlight)
