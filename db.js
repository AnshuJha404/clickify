let db;
let openrequest=indexedDB.open("mydataBase");
openrequest.addEventListener("success",(e)=>{
    console.log("success");
    db=openrequest.result;
})

openrequest.addEventListener("error",(e)=>{
    console.log("error");
})

openrequest.addEventListener("upgradeneeded",(e)=>{
    console.log("upgradeneeded");
    db=openrequest.result;
    db.createObjectStore("video",{keyPath:"id"});
    db.createObjectStore("image",{keyPath:"id"});

})