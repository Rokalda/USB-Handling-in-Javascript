
if("usb" in navigator){
 
    
    // First fill the table with all prevoisly paired devices;
    let paired_devices=[]
    const table=document.querySelector("table");
    navigator.usb.onconnect=(e)=>{
      addDevice(e.device)
    }


    navigator.usb.ondisconnect=(e)=>{
      removeDevice(e.device)
    }
    navigator.usb.getDevices().then((devices) => {
        
        devices.forEach((device) => {
        
          addDevice(device)
              });
      });
      
const filter_inputs=document.querySelector(".filter_box").querySelectorAll("input")
  const req_btn=document.querySelector(".req_btn");
  req_btn.addEventListener("click",requestUSBDevice);

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
    update_ui()
    let tr = 
    `<tr id="${device.vendorId}-${device.productId}">
        <td>${device.productId}</td>
        <td>${device.vendorId}</td>
        <td>${device.classCode}</td>
        <td>${device.manufacturerName}</td>
        <td>${device.serialNumber}</td>
        <td>${device.productName}</td>

    </tr>`

    tr=tr.replaceAll("undefined","N/A")
  table.querySelector("tbody").innerHTML+=tr;
  }

  function removeDevice(device){
    const r_index=paired_devices.indexOf(device);
    paired_devices.splice(r_index,1)
    update_ui()
    table.querySelector("tbody").removeChild( table.querySelector("tbody").querySelector(`tr[id="${device.vendorId}-${device.productId}"]`))
  }
}
else{
    document.body.innerHTML=
    `
    <h1 >This Browser does not support the USB Navigator Functionality, Click the link below to learn more</h1>
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/USB"  >MDN Reference</a>
    `
}