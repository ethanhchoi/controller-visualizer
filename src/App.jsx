import { useEffect,useState } from 'react';
import {PressedKeyIcons} from "../assets/Keyboard/pressed"
import {KeyIcons} from "../assets/Keyboard/unpressed"
//import {PressedControllerIcons} from "../assets/Controller/pressed"
import {ControllerIcons} from "../assets/Controller/unpressed"
import  ControllerOutline from "../assets/Controller/outline.svg?react"
import {MouseIcons} from "../assets/Mouse/sides"
import MouseOutline from "../assets/Mouse/body.svg?react" 


const KEY_LAYOUT = [
  ["grave","1","2","3","4","5","6","7","8","9","0","minus","equal","backspace"],
  ["tab","q","w","e","r","t","y","u","i","o","p","leftbrace","rightbrace","backslash"],
  ["capslock","a","s","d","f","g","h","j","k","l","semicolon","apostrophe","enter"],
  ["leftshift","z","x","c","v","b","n","m","comma","dot","slash","rightshift"],
  ["leftctrl","leftmeta","leftalt","space","rightalt","delete","rightctrl"]
  ];

const CONTROLLER_LAYOUT = [
  ["left","right"],
  ["tl","tr"],
  ["ab","al","ar","at"],
  ["select","center","start"],
  ["north","west","a","b"]
];
const MOUSE_LAYOUT = [
  ["left","right"],
]
function App() {

  //Will append/remove everytime a key is pressed
  const [buttonPressed,setButtonPressed] = useState({});//Pop add remove
  const [controllerPressed,setControllerValue] = useState({});
  const [mouseValue,setMouseValue] = useState({});
  const [controllerAxis,setAxisValue] = useState({});
  
  //Store 2 Axis: {"L":[X,Y],"R":[X,Y]}
  useEffect(() => {
    window.api.onInputEvent((event) => {
      
      //[0 - 256]
      //Arbitary example
      //[0 - 80] [81 - 160] [160 - 256]
      //[0 - 256]
      if(event.input==="axis")
      {
        //Axis Means stick / Trigger movement btw
        setAxisValue(prev => {
          const axis_values = {...prev};
          //"L_X"
          //"L_Y"
          //"R_X"
          //"R_Y"
          //If Within Deadzone, Don't move
          //if(event.value )
          axis_values[event.type] = event.value;
          return axis_values;
        })
        //Code 16, Status -1,0,1
        //Code:17, Status: -1,0,1
      }
      //Returns a blank for now
      //The rest of these will be button/mouse inputs
      switch(event.type)
      {
        case "mouse":
          setMouseValue(prev => {
          const mouse_inputs = {...prev}//Previous results
          if(event.value === 0)
            delete mouse_inputs[event.code]
          else
            mouse_inputs[event.code] =  true;
          return mouse_inputs; 
          })
          break;
        case "controller":
          setControllerValue(prev => {
          const button_list = {...prev}//Previous results
          if(event.value === 0)
            delete button_list[event.code]
          else
            button_list[event.code] =  true;
          return button_list; 
          })
          break;
        case "keyboard":
          setButtonPressed(prev => {
          const next = {...prev};//takes previous values as a dict
          if(event.value === 0)
            delete next[event.code]
            else
              next[event.code] = true //Key is pressed
            return next;
          })
          break;
      }
    })},[])
  //I'll ask him if we need to track recent text. 
  //Options to choose your own color? 
  return(<div>
    <h1>
      Keyboard + Controller Global Listener
    </h1>
    <p>
      Text will be placed here
    </p>
    
    <Keyboard layout = {KEY_LAYOUT} pressedButtons = {buttonPressed}/>
    <Controller layout = {CONTROLLER_LAYOUT} controllerPressed = {controllerPressed}/>
  </div>);

}
export default App;

function Keyboard({layout,pressedButtons,buttonSize=53})
{
  //let key_size = 53;
  let key_height_scale = 53/50;
  let custom_size_key = {
    "backspace":1.925,"tab":1.51,"backslash":1.41,"capslock":1.89,"enter":2.08,
    "leftshift":2.51,"rightshift":2.51,
    "leftctrl":1.23,"leftmeta":1.23,"leftalt":1.23,"space":6.62,"rightalt":1.23,"delete":1.23,"rightctrl":1.23
  };
  return(
    <div className="keyboard">
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row" style = {{display:"flex",justifyContent:"flex-start",alignItems:"center",flexDirection:"row"}}>
          {row.map(key => {
            //Checks current button key status
            const isPressed = !!pressedButtons[key];

            const Icon = isPressed ? PressedKeyIcons[key] : KeyIcons[key];
            
            if(!Icon)
            {
              console.warn("Missing Key for ",key,isPressed);
              return null;
            }
            //Apply multiplyer to special keys to scale with the rest of the keyboard
            //key_size = key in custom_size_key ? buttonSize * custom_size_key[key] : buttonSize
            
            return (
              <Icon
                key={key}
                width={key in custom_size_key ? buttonSize * custom_size_key[key] : buttonSize}
                height = {key_height_scale * buttonSize}
                style = {{fill:isPressed ? "green":"red"}}
                className={isPressed ? "pressed" : ""}
              />
            );
          })}
        </div>
      ))}
    </div>
  )
}

// This function should be able to load all detected devices 
//function setAxis({})
// Assign them a device and set output per device to that one specific device

function loadDevices({})
{
}


function Controller({layout,controllerPressed,buttonSize=73})
{
  return (
    <div className = "Controller">
      <ControllerOutline className = "Controller-Bg" style = {{fill:"blue"}}/>
      {layout.map((row,rowIndex) => (
        <div key = {rowIndex} className = "Controller Button">
          {row.map(button => {
            const isPressed = !!controllerPressed[button];
            const Icon = ControllerIcons[button];
            
            if(!Icon)
            {
              console.warn("Missing Button for ",button,isPressed);
              return null;
            }

            return(
            <Icon
              key = {button}
              width =  {buttonSize}
              height = {1.25 * buttonSize}
              style = {{fill: isPressed ? "blue" : "green"}}
            />)
          })}
        </div>
      ))}
    </div>
  )
}

function Mouse({buttonSize=74})
{

  return(
  <div className='Mouse'>  

  </div>)
}