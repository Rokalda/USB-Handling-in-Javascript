
if("usb" in navigator){
 
const prop_modal=  document.getElementById("property_dialog")
prop_modal.querySelector("h3").onclick=()=>{
prop_modal.querySelectorAll("input[type=checkbox]").forEach((chbox)=>{
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
    function hide_or_filterColumns(e){
        let isShown=e.target.checked;
        let col_name=e.target.id;
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
    propElement.querySelector("input").onchange=hide_or_filterColumns
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
    // Create the Device Row
    let tr = document.createElement("tr")
    tr.id=`${device.vendorId}-${device.productId}`
  
    usb_properties.forEach((prop)=>{
     const td=document.createElement("td")
     td.className=prop.prop_name
     td.hidden=!prop.shown;
     td.textContent=device[prop.prop_name]
     tr.appendChild(td)
    })

  
  tbody.appendChild(tr);
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