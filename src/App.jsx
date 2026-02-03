import { useEffect,useState } from 'react';


function App() {

  const [buttonPressed,setButtonPressed] = useState(null);
  const [controllerValue,setcontrollerValue] = useState(0);
  
  useEffect(() => {
    window.api.onInputEvent((event) => {
      console.log("Python Event:",event);
    })},[])
  return <div>Keyboard + Controller Global Listener</div>;
}

export default App;
