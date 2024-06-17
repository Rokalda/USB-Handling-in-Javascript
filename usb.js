
if("usb" in navigator){
 
const prop_modal=  document.getElementById("property_dialog")

const USB_ERRORS={SecurityError:18}

prop_modal.querySelector("h3").onclick=()=>{
prop_modal.querySelectorAll(".properties input[type=checkbox]").forEach((chbox)=>{
  if(!chbox.checked){
    chbox.click()
  }
})
}

const table=document.querySelector("table");
const tbody=table.querySelector("tbody");
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
      {prop_name:"usbVersionMajor",display_name:"USB Ver (MAJ)",shown:false},
      {prop_name:"usbVersionMinor",display_name:"USB Ver (MIN)",shown:false},




    
    ]
    function hide_or_showColumns(e){
    
        let isShown=e.target.checked;
        let col_name=e.target.id;
        usb_properties.find(prop=>prop.prop_name==col_name).shown=isShown;
        const affected_col= table.tHead.querySelector(`th.${col_name}`)
       
        if(isShown){
          affected_col.scrollIntoView({behavior:"smooth"})
        }
        affected_col.hidden=!isShown;

        tbody.querySelectorAll(`td.${col_name}`).forEach((td)=>{
          td.hidden=!isShown;
        });


       
    }
    //Loop Through all deez properties
    usb_properties.forEach(prop=>{
   
    const propElement=  document.createElement("div");
    propElement.className="prop"
    
    propElement.innerHTML=`
    <label>
      <input type="checkbox" name="${prop.prop_name}" id="${prop.prop_name}">
      ${prop.display_name}
    </label>`

    propElement.querySelector("input").checked=prop.shown;
    propElement.querySelector("input").onchange=hide_or_showColumns
      prop_modal.querySelector(".properties").appendChild(propElement)
      // After adding the property checkboxes, Adding the header columns

      const new_th=document.createElement("th");
      new_th.hidden=!prop.shown;
      new_th.className=prop.prop_name;
      new_th.textContent=prop.display_name;
      table.tHead.querySelector("tr").appendChild(new_th)
    })


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

req_btn.parentElement.addEventListener("submit",(ev)=>ev.preventDefault())

  prop_modal.querySelector("#close").onclick=closePropertyDialog
  
function closePropertyDialog(){
prop_modal.classList.remove("open")
}

function showPropertyDialog(){
table.scrollIntoView()
prop_modal.classList.add("open")

}

prop_btn.onclick=showPropertyDialog



  // added a quick, shortcut for the Request Button

  
  function requestUSBDevice(){
  const filtObj={}
  filter_inputs.forEach((input)=>{
    if(input.value!==''){
      filtObj[input.dataset.prop]=input.value;
    }
  })

    const filters = [
        
      
      ];
      filters.push(filtObj)
     let options= JSON.stringify(filters)
     console.log(options)
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
    
    update_ui()
    // Create the Device Row
    let tr = document.createElement("tr")
    tr.id=`${device.vendorId}-${device.productId}`
  
    console.log(device)
    tr.onclick=()=>{
      
    }
    // Add every single property available by looping through them
    usb_properties.forEach((prop)=>{
     const td=document.createElement("td")
     td.className=prop.prop_name;
     // if propery is not to be shown, use hidden attribute
     td.hidden=!prop.shown;
     td.textContent=device[prop.prop_name]
     tr.appendChild(td)
     
    })

  
  tbody.appendChild(tr);
  tr.scrollIntoView({behavior:"smooth"})
  
  }

 async function openDevice(device){
  try {
    await device.open()
  } catch (error) {
    if(error.code==USB_ERRORS.SecurityError){
      alert("Failed to Open the USB Device for security reasons")
    }
    
  }
 
 }

  function removeDevice(device){
    const r_index=paired_devices.indexOf(device);
    paired_devices.splice(r_index,1)
    update_ui()
    tbody.querySelector(`tr[id="${device.vendorId}-${device.productId}"]`).remove()
  }


}
else{
    document.body.innerHTML=
    `
    <h1 >This Browser does not support the USB Navigator Functionality, Click the link below to learn more</h1>
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/USB"  >MDN Reference</a>
    `
}