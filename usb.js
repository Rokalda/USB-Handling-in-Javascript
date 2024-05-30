
if("usb" in navigator){
 
    
    // First fill the table with all prevoisly paired devices;
    const table=document.querySelector("table");
    navigator.usb.getDevices().then((devices) => {
        
        devices.forEach((device) => {
          addDevice(device)
              });
      });
      
  const vendorId= document.getElementById("vendorId")
  const req_btn=document.querySelector(".req_btn");
  req_btn.addEventListener("click",requestUSBDevice);

  function requestUSBDevice(){
  
    const filters = [
        { vendorId:vendorId.value},
      
      ];
      navigator.usb
        .requestDevice({ filters })
        .then(addDevice)
        .catch((e) => {
          alert(`${e}`);
        });
     
  }

  function addDevice(device){
    let tr = 
    `<tr>
        <td>${device.productId}</td>
        <td>${device.vendorId}</td>
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