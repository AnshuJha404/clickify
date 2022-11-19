let back_button=document.querySelector(".back-button");
back_button.addEventListener("click",(e)=>{
    location.assign("index.html");
})
setTimeout(()=>{
    if(db){
        let videoTransaction=db.transaction("video","readwrite");
        let videoObjectStore=videoTransaction.objectStore("video");
        let videoRequest=videoObjectStore.getAll();
        videoRequest.addEventListener("success",(e)=>{
            let videoResult=videoRequest.result;
            let gallery_cont=document.querySelector(".gallery-cont");
            videoResult.forEach((videoObj)=>{
                let mediaCont=document.createElement("div");
                mediaCont.setAttribute("class","media-cont");
                mediaCont.setAttribute("id",videoObj.id);
                let url=URL.createObjectURL(videoObj.vidBlob);
                mediaCont.innerHTML=` 
                <div class="media-content">
                <video src=${url} autoplay loop muted></video>
                </div>
            
                <div class="action-btn">
                <div class="download-button">DOWNLOAD</div>
                <div class="delete-button">DELETE</div>
                </div>`
                let downloadButton=mediaCont.querySelector(".download-button");
                let deleteButton=mediaCont.querySelector(".delete-button");
                downloadButton.addEventListener("click",(e)=>{
                    handleDownload(mediaCont);
                })
                deleteButton.addEventListener("click",(e)=>{
                    handleDelete(mediaCont);
                })
                gallery_cont.appendChild(mediaCont);
            })
        });
        let imageTransaction=db.transaction("image","readwrite");
        let imageObjectStore=imageTransaction.objectStore("image");
        let imageRequest=imageObjectStore.getAll();
        imageRequest.addEventListener("success",(e)=>{
            let imageResult=imageRequest.result;
            let gallery_cont=document.querySelector(".gallery-cont");
            imageResult.forEach((imageObj)=>{
                let mediaCont=document.createElement("div");
                mediaCont.setAttribute("class","media-cont");
                mediaCont.setAttribute("id",imageObj.id);
                let url=imageObj.imgUrl;
                console.log(url);
                mediaCont.innerHTML=` 
                <div class="media-content">
                <img src="${url}">
                </div>
                <div class="action-btn">
                <div class="download-button">DOWNLOAD</div>
                <div class="delete-button">DELETE</div>
                </div>`

                let downloadButton=mediaCont.querySelector(".download-button");
                let deleteButton=mediaCont.querySelector(".delete-button");
                downloadButton.addEventListener("click",(e)=>{
                    handleDownload(mediaCont);
                })
                deleteButton.addEventListener("click",(e)=>{
                    handleDelete(mediaCont);
                })
                gallery_cont.appendChild(mediaCont);
            })
        });

            }
},1000);

function handleDownload(mediaContainer){
    console.log("within handle download");
    console.log(mediaContainer);
   let id=mediaContainer.getAttribute("id");
   console.log("id mil gyi : "+ id);
   console.log("sliced is : "+ id.slice(0,3));
   if(id.slice(0,3)=="vid"){
      // its a video element
      console.log("its a video");
      console.log("id is : "+ id);
      let video=mediaContainer.querySelector("video");
      console.log(video);
      let url=video.getAttribute("src");
      console.log(url);
      let a=document.createElement("a");
      a.href=url;
      a.download="stream.mp4";
      a.click();
   }else{
      // its an image element
      let image=mediaContainer.querySelector("img");
      let url=image.getAttribute("src");
      let a=document.createElement("a");
      a.href=url;
      a.download="image.jpg";
      a.click();
   }
}
function handleDelete(mediaContainer){
    
    let id=mediaContainer.getAttribute("id");
     let currentvideoTransaction=db.transaction("video","readwrite");
      let currentvideoObjectStore=currentvideoTransaction.objectStore("video");
      let currentimageTransaction=db.transaction("image","readwrite");
 let currentimageObjectStore=currentimageTransaction.objectStore("image");
    if(id.slice(0,3)=="vid"){
//        console.log(videoObjectStore);
  //      console.log(currentvideoObjectStore);
        currentvideoObjectStore.delete(id);
    }else{
       currentimageObjectStore.delete(id);
    }
    mediaContainer.remove();

}

