# Spoolman RRF Integration

## What is this?
This is a small Javascript application that integrates into Spoolman and ReprapFirmware

## How does it work?
ReprapFirmware Exposes a HTTP backend to pull data from.
this Script fetches the Machine Model from RRF and extracts the needed informations to track the FIlament usage (by tracking the Distance the extruder extrudes)

## How do i set it up?
### Important things to know:
- You have to use the Filament manager within RRF
- Filament has to be named a Spezific way to work with this inside of the manager

### Setup Script
Place the Script somewhere on a RPI or local server (Has to run while the printer is printing)
rename .env-example to .env
edit the informations in there to your likings
- DuetIP: Has to include http://, ip-address or Hostname works
- DuetPassword: has to be set for authentification, default password is reprap
- SpoolmanIP: has to include http://, ip-address or Hostname including the port
- Timer: Controls how often the script updates, default value is 10000 this equals 10 seconds

to start the script make sure node is installed
run npm index.js to launch the script.
running it headless is up to the enduser

Alternative build of the dockerfile, make the same changes there to the ENV variables there as to the .env file or pass them in during container generation
this will run the script headless without any additional steps needed

### Setup RRF
in order for the Script to work is the following required:
- Filaments in the Filament Manager have to be named a spezific way. starting with the Spoolman SpoolID and then a Underscore Example: 4_PCTG_Extrudr_Clear
- the Filament has to be loaded into a Tool inside of DWC
- Extruder position should be not reset after each layer, since the script doesnt know when the printer starts a new layer this will cause issues with the tracking. Resetting it at the start or the end of a print is wanted.
This is required for this to work, this way the Script knows what spool to update, and this approach takes manual work out of it so you have to setup it once, not every time you switch filament.

Confirmed to work with RRF 3.4 and 3.5rc2

## Issues
Stuff that will break this script potentially:
- Running more than 2 Tools, Wrote the script with Idex printer in mind, could be potentially fixed, but it wont support a infinite number of toolheads
- There will be errors in the console when DWC is not reachable, but these errors are catched by the script and handled.
- the Tracking of filament is potentially inaccurate since it reads the current position of the Extruder, retractions might cause inaccuracies