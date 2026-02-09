from evdev import InputDevice, list_devices, ecodes, categorize
import asyncio, json, sys
import pygame


#Make sure evdev is installed on system
keyboards = []
controllers = []
mouse = []
devices = [InputDevice(path) for path in list_devices()]
pygame.init()
pygame.joystick.init()
joysticks = {}

print("Detected:",pygame.joystick.get_count(),"joysticks")
#Initializes Joystick
#Takes both Left and Right
#Not gonna create any Hot swappable shit- Takes too much to input.
#Im gonna tell them to quit and retry again


#Create Array of Joysticks
for controller_device in range(pygame.joystick.get_count()):
    #Calls All Joysticks + Initializes

    joystick = pygame.joystick.Joystick(controller_device)
    #Initializes Joystick
    joystick.init()
    
    joysticks[js.get_name()] = js
    vibrateController(js)

def vibrateController(joystick_device,vibration_max=5.0,time=750):
    #Unique Vibration pattern probably like
    #-.-
    joystick_device.rumble(1.0,vibration_max,time)


#Disable the Touchpad on Controller
#Try to disable mouse inputs completely because we don't need that read
###Fix to top: If connected to virtual usb, counts as virtual controller. 

for dev in devices:

    caps = dev.capabilities()
    #All keys from a keybaord
    keys = caps.get(ecodes.EV_KEY, [])
    
    #Abs = Joystick Movement
    abs_axes = caps.get(ecodes.EV_ABS, [])
    #Wheel Position
    rel_axes = caps.get(ecodes.EV_REL, [])

    # Detect keyboard
    if rel_axes and (ecodes.REL_X in rel_axes or ecodes.REL_Y in rel_axes):
        mouse.append(dev)
        print("Mouse Detected", dev.path, dev.name)        
    elif ecodes.KEY_A in keys and ecodes.KEY_Z in keys:
        keyboards.append(dev)
        print("Keyboard detected:", dev.path, dev.name)
    # Detect controller / joystick / gamepad
    elif abs_axes and keys:
        #Reject Touchpad here ####################

        controllers.append(dev)
        print("Controller detected:", dev.path, dev.name)

print("\nStarting input listeners...\n")


#Type keyboard for mouse
async def read_device(device, device_type):
    async for event in device.async_read_loop():
        if event.type == ecodes.EV_KEY and event.code in ecodes.BTN:
            #Convert the Event Code to a Button Event
            btn_code = ecodes.BTN[event.code]
            
            #Mouse + Controller Buttons here

            #X Direction Button X_B
            #Y Direction Button Y_B
            #if(event.code == 16):
            #    btn_code = "X_B"
            #if(event.code == 17):
            #    btn_code = "Y_B"
            if(len(btn_code)<4):
                btn_code = btn_code[0]
            #Create Object
            data = {
                "type": device_type,
                "device": device.name,
                "input": "button",
                "code": btn_code[len("BTN_"):].lower(),
                "value": event.value
            }
            print("Mouse/Button:", data, flush=True)
            sys.stdout.write(json.dumps(data) + "\n")
            sys.stdout.flush()
            
        elif event.type == ecodes.EV_KEY:
            data = {
                "type": device_type,
                "device": device.name,
                "input": "button",
                "code": ecodes.KEY[event.code][len("KEY_"):].lower(), #String Concats until KEY_###
                "value": event.value  # 1=down, 0=up, 2=hold
            }
            print("Button Pressed: "+data["code"],flush = True)
            sys.stdout.write(json.dumps(data)+ "\n")
            sys.stdout.flush()

        # Analog sticks / triggers
        elif event.type == ecodes.EV_ABS:
            if(event.code == 2 or event.code == 5):
                #If triggers, else
                data = {
                    "type": device_type,
                    "device": device.name,
                    "input": "axis",
                    "code": event.code,
                    "value": event.value
                }
            else:
                pygame.event.pump()
                
                controller = joysticks[device.name]
                data = {
                    "type": device_type,
                    "device": device.name,
                    "input": "axis",
                    "code": event.code,
                    "value": [controller.get_axis(0),controller.get_axis(1),
                    controller.get_axis(3),controller.get_axis(4)]
                }

            sys.stdout.write(json.dumps(data)+ "\n")
            sys.stdout.flush()
#[1] PYTHON SAYS: {"type": "keyboard", "device": "Logitech G Pro", "input": "button", "code": 272, "value": 1} 
#[1] PYTHON SAYS: {"type": "keyboard", "device": "Logitech G Pro", "input": "button", "code": 272, "value": 0}



loop = asyncio.get_event_loop()

for dev in keyboards:
    loop.create_task(read_device(dev, "keyboard"))

for dev in controllers:
    loop.create_task(read_device(dev, "controller"))

for dev in mouse:
    loop.create_task(read_device(dev, "mouse"))

loop.run_forever()