import { useEffect,useState } from 'react';


function App() {

  const [buttonPressed,setButtonPressed] = useState(null);
  const [controllerValue,setcontrollerValue] = useState(0);
  
  useEffect(() => {
    window.api.onInputEvent((event) => {
      console.log("Python Event:",event);
      if(event.input === 'button')
      {
        // Example event: { type: 'keyboard', device: 'Logitech G Pro', input: 'button', code: 272, value: 1 }
        //Handles Buttons
        handleButtonEvent(event)
        
      }
      else if(event.input === 'axis'){
        //Handles joysticks 
      }
    })},[])
  return <div>Keyboard + Controller Global Listener</div>;
}

function handleButtonEvent(event)
{
  //Handles Button/Key inputs Events
  if(event.type === 'keyboard')
  {
    
  }
  else if(event.type === 'controller')
  {

  }
}

function readButtonInput(code)
{
  if(code === '')
  {}
}

function handleAxisEvent()
{
  //Handles Joystick Events
}

export default App;
