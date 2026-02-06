import { useEffect,useState } from 'react';
import {PressedKeyIcons} from "../assets/Keyboard/pressed"
import {KeyIcons} from "../assets/Keyboard/unpressed"
function App() {

  //Will append/remove everytime a key is pressed
  const [buttonPressed,setButtonPressed] = useState({});//Pop add remove
  const [controllerValue,setControllerValue] = useState({});
  const [mouseValue,setMouseValue] = useState({});
  const [controllerAxis,setAxisValue] = useState({});
  
  //Assign to Per Device....?

  const KEY_LAYOUT = [
  ["grave","1","2","3","4","5","6","7","8","9","0","minus","equal","backspace"],
  ["tab","q","w","e","r","t","y","u","i","o","p","leftbrace","rightbrace","backslash"],
  ["capslock","a","s","d","f","g","h","j","k","l","semicolon","apostrophe","enter"],
  ["leftshift","z","x","c","v","b","n","m","comma","dot","slash","rightshift"],
  ["leftctrl","leftmeta","leftalt","space","rightalt","delete","rightctrl"]
  ];


  /*PS5 Controller Layout
    BTN_NORTH = Triangle
    BTN_WEST = Square
    BTN_A = X
    BTN_B = Circle

    Left Siode:
    -1: Top,Left
    1: Bottom,Right
    16 --> Horizontal Axis
    17 --> Vertical Axis
    
  */
  /*Mouse Layout
    leftClick: BTN_LEFT,
    rightClick: BTN_RIGHT
    I won't add side buttons unless you believe it's necessary
  */


  useEffect(() => {
    window.api.onInputEvent((event) => {
      console.log("Python Event:",event);
      
      //button vs axis
      if(event.input==="axis")
      {
        setAxisValue(prev => {
          const axis_values = {...prev};
          //if()//If the input is valid
          if(event.status === 0)
            delete axis_values[event.code]
          else
            axis_values[event.code] = true;
          return axis_values;
        })
        //Code:17, Status: -1
      }
      //Returns a blank for now
      //The rest of these will be button/mouse inputs
      
      if(event.type === "mouse")
      {
        setMouseValue(prev => {
          const mouse_inputs = {...prev}//Previous results
          if(event.value === 0)
            delete mouse_inputs[event.code]
          else
            mouse_inputs[event.code] =  true;
          return mouse_inputs; 
        })
      }
      if(event.type === "controller")
      {
        setControllerValue(prev => {
          const button_list = {...prev}//Previous results
          if(event.value === 0)
            delete button_list[event.code]
          else
            button_list[event.code] =  true;
          return button_list; 
        })
      }
      if(event.type === "keyboard")
      {
        setButtonPressed(prev => {
        const next = {...prev};//takes previous values as a dict
        if(event.value === 0)
          delete next[event.code]
          else
            next[event.code] = true //Key is pressed
          return next;
        })
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
    


  </div>);

}
export default App;

function Keyboard({layout,pressedButtons,buttonSize=73})
{
  let key_size = 53;
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
            
            key_size = key in custom_size_key ? buttonSize * custom_size_key[key] : buttonSize
            return (
              <Icon
                key={key}
                width={key_size}
                height = {key_height_scale * buttonSize}
                className={isPressed ? "pressed" : ""}
              />
            );
          })}
        </div>
      ))}
    </div>
  )
}