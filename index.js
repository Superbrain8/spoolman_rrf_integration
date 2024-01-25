const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config()

const DuetIP = process.env.DuetIP
const DuetPassword = process.env.DuetPassword
const SpoolmanIP = process.env.SpoolmanIP
const TIME =process.env.Timer//Time in miliseconds to check for filament useage

// Initial Connection to Duet and obtaining a session key
async function getToken() {
const response = await fetch(DuetIP+"/rr_connect?sessionKey=yes&password="+DuetPassword);
const data = await response.json();
if (data.err == 1) {
    console.log("Invalid password")
}else if(data.err == 2){
    console.log("To Many Sessions active")
}
return data.sessionKey
}
// Fetching the Machine Model from Duet
async function getModelMove() {
    const token = await getToken()
    const headers = {
        "X-Session-Key": token
    }
    let data
    const response = await fetch(DuetIP+"/rr_model?password="+DuetPassword+"&key=move", { method: 'GET', headers: headers})
     if (!response.ok) {
        console.log(response.status, response.statusText);
     } else {
        data = await response.json();
        
     }
     return data.result.extruders
} 

//update filament in Spoolman
async function updateFilament(id, length) {
    try {
    const response = await fetch(SpoolmanIP+"/api/v1/spool/"+id+"/use", { method: 'PUT', body: JSON.stringify({"use_length": length}), headers: { 'Content-Type': 'application/json' }});
    const data = await response.json();
    return data
    } catch (error) {
        console.error(error)
    }
}


let oldPosition = [{},{}]   //Semi Persistant storage to keep track of the used filament, might break with printer that have more than 2 toolheads

//Loop to track the Filament useage and handling the updating to Spoolman
async function trackFilament(){
    try {
    const extruders = await getModelMove()
    const filament = extruders.map((extruder) => {
        const filament = extruder.filament
        const id = filament.substring(0, filament.indexOf("_"));
        return {
            id: id,
            position: extruder.position
        }
    })
    for (i in filament) {
        const curposition = filament[i].position
        const id = filament[i].id
        const newposition = curposition-JSON.stringify(oldPosition[i].curposition)
        oldPosition[i] = {id, curposition}
        if (newposition > 0) {
            console.log("update filament")
        updateFilament(id, newposition).then((data) => {
          //  console.log(data)
        })
        }
    }
    }catch(error){
        console.log(error)
    }   
}
console.log("Starting Filament Tracker")
setInterval(trackFilament, TIME) //Loop every 10 seconds


