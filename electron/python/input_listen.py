from evdev import InputDevice, list_devices, ecodes
import asyncio, json, sys

keyboards = []
controllers = []
devices = [InputDevice(path) for path in list_devices()]
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
    if ecodes.KEY_A in keys:
        keyboards.append(dev)
        print("Keyboard detected:", dev.path, dev.name)

    # Detect controller / joystick / gamepad
    elif ecodes.EV_ABS in caps and ecodes.EV_KEY in caps:
        controllers.append(dev)
        print("Controller detected:", dev.path, dev.name)

print("\nStarting input listeners...\n")


#Type keyboard for mouse
async def read_device(device, device_type):
    async for event in device.async_read_loop():
        # Buttons / Keys
        if event.type == ecodes.EV_KEY:
            ##readButton()
            data = {
                "type": device_type,
                "device": device.name,
                "input": "button",
                "code": event.code,
                "value": event.value  # 1=down, 0=up, 2=hold
            }
            sys.stdout.write(json.dumps(data)+ "\n")
            sys.stdout.flush()

        # Analog sticks / triggers
        elif event.type == ecodes.EV_ABS:
            data = {
                "type": device_type,
                "device": device.name,
                "input": "axis",
                "code": event.code,
                "value": event.value
            }
            sys.stdout.write(json.dumps(data) + "\n")
            sys.stdout.flush()
#[1] PYTHON SAYS: {"type": "keyboard", "device": "Logitech G Pro", "input": "button", "code": 272, "value": 1} 
#[1] PYTHON SAYS: {"type": "keyboard", "device": "Logitech G Pro", "input": "button", "code": 272, "value": 0}

##device_type,device_name(multiple may be added in future),device_input,device_value
##readInput[JS side](type,device_name,input_type,code,value?[doesn't matter to me]) --> {"Device_Type","Device_Name",InputType+Output? ==> "A"?,key_status}Tells which SVG should be pressed and triggered. 
#

loop = asyncio.get_event_loop()

for dev in keyboards:
    loop.create_task(read_device(dev, "keyboard"))

for dev in controllers:
    loop.create_task(read_device(dev, "controller"))

loop.run_forever()