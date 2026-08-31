
(function(){
  const DB_NAME = "duoLoveMediaDB";
  const DB_VERSION = 1;
  const STORE = "media";

  function openDB(){
    return new Promise((resolve,reject)=>{
      const request=indexedDB.open(DB_NAME,DB_VERSION);

      request.onupgradeneeded=()=>{
        const db=request.result;
        if(!db.objectStoreNames.contains(STORE)){
          const store=db.createObjectStore(STORE,{keyPath:"id"});
          store.createIndex("ownerId","ownerId",{unique:false});
          store.createIndex("kind","kind",{unique:false});
        }
      };

      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
  }

  function uid(prefix="media"){
    if(window.crypto && crypto.randomUUID){
      return prefix+"_"+crypto.randomUUID();
    }
    return prefix+"_"+Date.now()+"_"+Math.random().toString(36).slice(2);
  }

  async function compressImage(file,maxSize=1600,quality=.84){
    if(!file || !String(file.type||"").startsWith("image/")){
      throw new Error("Fișierul nu este imagine.");
    }

    const bitmap=await createImageBitmap(file);
    const scale=Math.min(1,maxSize/Math.max(bitmap.width,bitmap.height));
    const width=Math.max(1,Math.round(bitmap.width*scale));
    const height=Math.max(1,Math.round(bitmap.height*scale));

    const canvas=document.createElement("canvas");
    canvas.width=width;
    canvas.height=height;

    const ctx=canvas.getContext("2d");
    ctx.drawImage(bitmap,0,0,width,height);
    bitmap.close();

    return await new Promise((resolve,reject)=>{
      canvas.toBlob(
        blob=>blob?resolve(blob):reject(new Error("Nu am putut procesa imaginea.")),
        "image/jpeg",
        quality
      );
    });
  }

  async function put(record){
    const db=await openDB();

    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,"readwrite");
      tx.objectStore(STORE).put(record);
      tx.oncomplete=()=>resolve(record);
      tx.onerror=()=>reject(tx.error);
    });
  }

  async function saveFiles(ownerId,kind,files){
    const list=Array.from(files||[]).filter(f=>String(f.type||"").startsWith("image/"));
    const saved=[];

    for(const file of list){
      const blob=await compressImage(file);
      const record={
        id:uid(kind),
        ownerId,
        kind,
        blob,
        originalName:file.name||"poza.jpg",
        createdAt:Date.now()
      };
      await put(record);
      saved.push(record);
    }

    return saved;
  }

  async function listOwner(ownerId){
    const db=await openDB();

    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,"readonly");
      const index=tx.objectStore(STORE).index("ownerId");
      const request=index.getAll(IDBKeyRange.only(ownerId));
      request.onsuccess=()=>resolve((request.result||[]).sort((a,b)=>a.createdAt-b.createdAt));
      request.onerror=()=>reject(request.error);
    });
  }

  async function deleteOwner(ownerId){
    const records=await listOwner(ownerId);
    if(!records.length) return;

    const db=await openDB();

    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,"readwrite");
      const store=tx.objectStore(STORE);
      records.forEach(r=>store.delete(r.id));
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error);
    });
  }

  function objectURL(record){
    return URL.createObjectURL(record.blob);
  }

  window.DuoMedia={
    uid,
    compressImage,
    saveFiles,
    listOwner,
    deleteOwner,
    objectURL
  };
})();
