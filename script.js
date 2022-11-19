let video=document.querySelector("video");
let record_btn_cont=document.querySelector(".record-btn-cont");
let record_btn=document.querySelector(".record-btn");
let timerBox=document.querySelector(".timer-cont");
let filterLayer=document.querySelector(".filter-layer");
let allFilters=document.querySelectorAll(".filter");
let capture_btn_cont=document.querySelector(".capture-btn-cont");
let capture_btn=document.querySelector(".capture-btn");
let gallery_cont=document.querySelector(".gallery-cont");

let constraints={
    video:true,
    audio:true
};
let recorder;
let recordFlag=false;
let chunks=[];
let frames=[]
let transparentColor="transparent";
navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
   video.srcObject=stream;
   recorder=new MediaRecorder(stream);
   recorder.addEventListener("start",(e)=>{
       console.log("started");
   //    alert("started");
   
       chunks=[];
       frames=[];
   })
   recorder.addEventListener("dataavailable",(e)=>{
       console.log("data available");
       chunks.push(e.data);
       let canvas=document.createElement("canvas");
       canvas.width=video.videoWidth;
       canvas.height=video.videoHeight;
       let tool=canvas.getContext('2d');
       tool.fillStyle = transparentColor;
       console.log("add hua : "+ transparentColor);
       
       tool.drawImage(video, 0, 0, canvas.width, canvas.height);
       tool.fillRect(0, 0, canvas.width, canvas.height);
       let frame = tool.getImageData(0, 0, canvas.width, canvas.height);
       frames.push(frame);
      // alert("data available");
   })
   recorder.addEventListener("stop",(e)=>{
      // conversion of chunks into video
     console.log("stop recording");
     console.log(chunks);
     // console.log("length is "+chunks.length);
      let blob=new Blob(chunks,{type:"video/mp4"});

      // add this entry into object stores of indexDB
      if(db){
          let videoTransaction=db.transaction("video","readwrite");
          let videoObjectStore=videoTransaction.objectStore("video");
          let videoEntry={
              id:`vid-${shortid()}`,
              vidBlob:blob
          }
          videoObjectStore.add(videoEntry);
      }
    //   let url=URL.createObjectURL(blob);
    //   let a=document.createElement("a");
    //   a.href=url;
    //   a.download="stream.mp4";
    //   a.click();
    //  alert("stopped");
   });
});

record_btn_cont.addEventListener("click",(e)=>{
    if(!recorder){
        return;
    }
    recordFlag=!recordFlag;
    if(recordFlag){
        recorder.start();
        startTimer();
        timerBox.style.display="block";
        record_btn.classList.add("action-record");   
    }else{
        recorder.stop();
        stopTimer();
        timerBox.style.display="none";
        record_btn.classList.remove("action-record");
    }
});

let timerId;
let counter=0;
function startTimer(){   
    function displayTimer(){
       let totalSeconds=counter;
       let hrs=Number.parseInt(totalSeconds/3600);
       totalSeconds=Number.parseInt(totalSeconds%3600);
       let minutes=Number.parseInt(totalSeconds/60);
       let seconds=Number.parseInt(totalSeconds%60);
       hrs=hrs<10?"0"+hrs:hrs;
       minutes=minutes<10?"0"+minutes:minutes;
       seconds=seconds<10?"0"+seconds:seconds;
       timerBox.innerText=hrs+":"+minutes+":"+seconds;
       counter++;
    }
    timerId=setInterval(displayTimer,1000);
}

function stopTimer(){
    timerBox.innerText="00:00:00";
    counter=0;
}

capture_btn.addEventListener("click",(e)=>{
   let canvas=document.createElement("canvas");
   canvas.width=video.videoWidth;
   canvas.height=video.videoHeight;
   let tool=canvas.getContext('2d');
   tool.fillStyle = transparentColor;
//   console.log("add hua : "+ transparentColor);
   
   tool.drawImage(video, 0, 0, canvas.width, canvas.height);
   tool.fillRect(0, 0, canvas.width, canvas.height);
   let dataURL = canvas.toDataURL();

   if(db){
    dataURL = canvas.toDataURL();
    let imageTransaction=db.transaction("image","readwrite");
    let imageObjectStore=imageTransaction.objectStore("image");
    let imageEntry={
        id:`img-${shortid()}`,
        imgUrl:dataURL
    }
    imageObjectStore.add(imageEntry);
}
//    let a=document.createElement("a");
//     a.href=dataURL;
//     a.download="image.jpg";
//     a.click();
});

allFilters.forEach(filter=>{
filter.addEventListener("click",(e)=>{
    console.log("clicked");
    transparentColor=getComputedStyle(filter).getPropertyValue("background-color");
    console.log("transparentColor : "+ transparentColor);
    video.className=transparentColor;
    filterLayer.style.backgroundColor=transparentColor;
})
});

gallery_cont.addEventListener("click",(e)=>{
    console.log("gallery cont clicked");
    location.assign("gallery.html");
})





