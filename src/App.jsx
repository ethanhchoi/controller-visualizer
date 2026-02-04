import { useEffect,useState } from 'react';
import {PressedKeyIcons} from "../assets/Keyboard/pressed"
import {KeyIcons} from "../assets/Keyboard/unpressed"
function App() {

  //Will append/remove everytime a key is pressed
  const [buttonPressed,setButtonPressed] = useState({});//Pop add remove
  const [controllerValue,setcontrollerValue] = useState({});
  const KEY_LAYOUT = [
  ["grave","1","2","3","4","5","6","7","8","9","0","minus","equal","backspace"],
  ["tab","q","w","e","r","t","y","u","i","o","p","leftbrace","rightbrace","backslash"],
  ["capslock","a","s","d","f","g","h","j","k","l","semicolon","apostrophe","enter"],
  ["leftshift","z","x","c","v","b","n","m","comma","dot","slash","rightshift"],
  ["leftctrl","leftmeta","leftalt","space","rightalt","delete","rightctrl"]
  ];


  useEffect(() => {
    window.api.onInputEvent((event) => {
      //console.log("Python Event:",event);
      
      //button vs axis
      if(event.input==="axis") return;//Returns a blank for now
      
      setButtonPressed(prev => {
        const next = {...prev};//takes previous values as a dict
        if(event.value === 0)
          delete next[event.code]
        else
          next[event.code] = true //Key is pressed
        return next;
      })
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

    <div className="keyboard">
      {KEY_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map(key => {
            //Checks current button key status
            const isPressed = !!buttonPressed[key];

            var Icon;
            if(isPressed) Icon = PressedKeyIcons[key];
            else Icon = KeyIcons[key];
            
            if(!Icon)
            {
              console.warn("Missing Key for ",key,isPressed);
              return null;
            }

            return (
              <Icon
                key={key}
                width={50}
                className={isPressed ? "pressed" : ""}
              />
            );
          })}
        </div>
      ))}
    </div>


  </div>);

  
}
export default App;