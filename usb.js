
if("usb" in navigator){
 
    
    // First fill the table with all prevoisly paired devices;
    let paired_devices=[]
    const table=document.querySelector("table");
    navigator.usb.getDevices().then((devices) => {
        paired_devices=devices;
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

  function addDevice(device){
    console.log(device)
    let tr = 
    `<tr>
        <td>${device.productId}</td>
        <td>${device.vendorId}</td>
        <td>${device.classCode}</td>
        <td>${device.manufacturerName}</td>
        <td>${device.serialNumber}</td>
        <td>${device.productName}</td>

    </tr>`
  table.querySelector("tbody").innerHTML+=tr;
  }
}
else{
    document.body.innerHTML=
    `
    <h1 >This Browser does not support the USB Navigator Functionality, Click the link below to learn more</h1>
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/USB"  >MDN Reference</a>
    `
}