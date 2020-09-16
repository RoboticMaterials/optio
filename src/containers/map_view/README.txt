This is an attempt to discribe how this flow works...

Map:
...


Locations: 

Current Dir: components/side_bar/content/locations/locations_content
1) Locations are originally created here
2) Each location type (workstation, cart, device, etc...) has a template located in location templates (Devices is seperate for now...)
3) When a new location is added to the map, its data is put into the reducer with a key: 'temp' which indicates it has not been saved yet