
if("usb" in navigator){
 
const prop_modal=  document.getElementById("property_dialog")
    // First fill the table with all prevoisly paired devices;
    let paired_devices=[]
    // These are the USB Device Propeties that can be shown on 
    let usb_properties=[
      {prop_name:"productId",display_name:"PID",shown:true},
      {prop_name:"vendorId",display_name:"VID",shown:true},
      {prop_name:"deviceClass",display_name:"Class Code",shown:true},
      
      
      {prop_name:"manufacturerName",display_name:"Manufacturer Name",shown:true},
      {prop_name:"serialNumber",display_name:"Serial Number",shown:true},
      {prop_name:"productName",display_name:"Product Name",shown:true},
      {prop_name:"deviceProtocol",display_name:"Device Protocol",shown:false},
      {prop_name:"deviceSubclass",display_name:"Sub Class Code",shown:false},
      {prop_name:"deviceVersionMajor",display_name:"Device Ver (MAJ)",shown:false},
      {prop_name:"deviceVersionMinor",display_name:"Device Ver (MIN)",shown:false},


    
    ]

    usb_properties.forEach(prop=>{
    const propElement=  document.createElement("div");
    propElement.className="prop"
    
    propElement.innerHTML=`
    <label>
      <input type="checkbox" name="${prop.prop_name}" id="${prop.prop_name}">
      ${prop.display_name}
    </label>`
    propElement.querySelector("input").checked=prop.shown;

      prop_modal.querySelector(".properties").appendChild(propElement)
    })
    const table=document.querySelector("table");
    const tbody=table.querySelector("tbody");

    navigator.usb.onconnect=(e)=>{
      addDevice(e.device)
    }


    navigator.usb.ondisconnect=(e)=>{
      removeDevice(e.device)
    }
    // Get all devices previuosly paired and add them to the table
    navigator.usb.getDevices().then((devices) => {
        
        devices.forEach((device) => {
        
          addDevice(device)
              });
      });
      
const filter_inputs=document.querySelector(".filter_box").querySelectorAll("input")
  const req_btn=document.querySelector(".req_btn");
  const prop_btn = document.querySelector(".prop_btn")
  req_btn.addEventListener("click",requestUSBDevice);

  prop_modal.querySelector("#close").onclick=()=>prop_modal.close()
  

prop_btn.onclick=()=>  prop_modal.showModal()



  // added a quick, shortcut for the Request Button

  document.addEventListener("keypress",(ev)=>{
    if(ev.key=="Enter"){
      
      req_btn.click()
    }

  })
  function requestUSBDevice(){
  const filtObj={}
filter_inputs.forEach((input)=>{
  if(input.value!==''){
    filtObj[input.id]=input.value;
  }
})

    const filters = [
        
      
      ];
      filters.push(filtObj)
      navigator.usb
        .requestDevice({ filters })
        .then((device)=>{
          if(!paired_devices.includes(device))
            addDevice(device)
          else
            alert("This Device is already Paired")
        })
        .catch((e) => {
        if(e.name=="TypeError"){
          alert(e.message)
        }
        
        });
     
  }
    
    const update_ui=()=>document.querySelector(".list_h2").querySelector("span").textContent=`(${paired_devices.length})`
    
  function addDevice(device){
    
    paired_devices.push(device)
    console.log(paired_devices)
    update_ui()
    let tr = 
    `<tr id="${device.vendorId}-${device.productId}">
        <td>${device.productId}</td>
        <td>${device.vendorId}</td>
        <td>${device.deviceClass}</td>
        <td>${device.manufacturerName}</td>
        <td>${device.serialNumber}</td>
        <td>${device.productName}</td>

    </tr>`

    tr=tr.replaceAll("undefined","N/A")
  tbody.innerHTML+=tr;
  }

  function removeDevice(device){
    const r_index=paired_devices.indexOf(device);
    paired_devices.splice(r_index,1)
    update_ui()
    tbody.removeChild(tbody.querySelector(`tr[id="${device.vendorId}-${device.productId}"]`))
  }
}
else{
    document.body.innerHTML=
    `
    <h1 >This Browser does not support the USB Navigator Functionality, Click the link below to learn more</h1>
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/USB"  >MDN Reference</a>
    `
}