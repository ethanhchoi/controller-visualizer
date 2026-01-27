import { useEffect,useState } from 'react';


function App() {
  const [activeKeys,setActiveKeys]= useState(null);
  const [activeControllerButtons,setActiveControllerButtons]= useState(null);
  useEffect(() => {
    window.electronAPI.onKeyEvent((event) => {
      console.log("JS says: "+event)
    })
    window.electronAPI.onControllerEvent((event) => {
      console.log(event)
    })
  })

  return <div>Keyboard + Controller Global Listener</div>;
}

export default App;
