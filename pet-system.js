
(function(){
  const K = {
    selected: "duoSelectedPet",
    coins: "duoPetCoins",
    hearts: "duoPetHearts",
    inventory: "duoPetInventoryV45",
    mission: "duoPetDailyMissionV45"
  };

  const PETS = {
    teddy:{name:"Teddy",type:"Ursuleț",image:"./ursulet.png",emoji:"🧸"},
    dog:{name:"Mochi",type:"Cățeluș",image:"./animal-dog-real.png",emoji:"🐶"},
    cat:{name:"Luna",type:"Pisicuță",image:"./animal-cat-real.png",emoji:"🐱"}
  };

  const MISSION_DEFS = [
    {id:"feed", title:"Hrănește animalul de 3 ori", icon:"🍲", goal:3, coins:60, hearts:5},
    {id:"play", title:"Joacă-te de 2 ori", icon:"🎈", goal:2, coins:45, hearts:4},
    {id:"wash", title:"Spală animalul o dată", icon:"🛁", goal:1, coins:35, hearts:3},
    {id:"sleep", title:"Pune animalul la nani", icon:"🌙", goal:1, coins:35, hearts:3},
    {id:"buyFood", title:"Cumpără 2 produse de mâncare", icon:"🛒", goal:2, coins:55, hearts:4},
    {id:"care", title:"Ține toate nevoile la minimum 80%", icon:"💗", goal:1, coins:100, hearts:10}
  ];

  function todayKey(){
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth()+1).padStart(2,"0"),
      String(d.getDate()).padStart(2,"0")
    ].join("-");
  }

  function clamp(v){
    return Math.max(0,Math.min(100,Math.round(Number(v)||0)));
  }

  function selectedPet(){
    const key = localStorage.getItem(K.selected) || "teddy";
    return PETS[key] ? key : "teddy";
  }

  function getCoins(){
    const raw = localStorage.getItem(K.coins);
    if(raw === null){
      localStorage.setItem(K.coins,"250");
      return 250;
    }
    return Math.max(0,Number(raw)||0);
  }

  function setCoins(v){
    localStorage.setItem(K.coins,String(Math.max(0,Math.round(Number(v)||0))));
  }

  function addCoins(v){
    setCoins(getCoins() + Number(v||0));
    return getCoins();
  }

  function spendCoins(v){
    v = Number(v||0);
    const current = getCoins();
    if(current < v) return false;
    setCoins(current - v);
    return true;
  }

  function getHearts(){
    return Math.max(0,Number(localStorage.getItem(K.hearts)||0));
  }

  function addHearts(v){
    localStorage.setItem(K.hearts,String(getHearts()+Math.max(0,Number(v)||0)));
    return getHearts();
  }

  function defaultInventory(){
    return {
      food:3,
      premium:0,
      treat:1,
      shampoo:2,
      toy:1
    };
  }

  function getInventory(){
    try{
      const saved = JSON.parse(localStorage.getItem(K.inventory)||"null");
      if(saved && typeof saved==="object"){
        return Object.assign(defaultInventory(),saved);
      }
    }catch(e){}
    const inv = defaultInventory();
    saveInventory(inv);
    return inv;
  }

  function saveInventory(inv){
    localStorage.setItem(K.inventory,JSON.stringify(inv));
  }

  function addInventory(item,qty){
    const inv = getInventory();
    inv[item] = Math.max(0,Number(inv[item]||0)+Number(qty||0));
    saveInventory(inv);
    return inv;
  }

  function useInventory(item,qty=1){
    const inv = getInventory();
    qty = Math.max(1,Number(qty)||1);
    if(Number(inv[item]||0) < qty) return false;
    inv[item] -= qty;
    saveInventory(inv);
    return true;
  }

  function statsKey(petKey){
    return "duoPetStatsV45_"+petKey;
  }

  function oldStatsKey(petKey){
    return "duoPetStats_"+petKey;
  }

  function defaultStats(){
    return {
      food:82,
      happy:85,
      energy:80,
      clean:90,
      updatedAt:Date.now()
    };
  }

  function saveStats(petKey,stats){
    stats.food=clamp(stats.food);
    stats.happy=clamp(stats.happy);
    stats.energy=clamp(stats.energy);
    stats.clean=clamp(stats.clean);
    stats.updatedAt=Date.now();
    localStorage.setItem(statsKey(petKey),JSON.stringify(stats));
  }

  function getStats(petKey){
    let s = null;

    try{
      s = JSON.parse(localStorage.getItem(statsKey(petKey))||"null");
    }catch(e){}

    // Migrare din v44: hunger mare = mai flămând -> food = 100-hunger.
    if(!s){
      try{
        const old = JSON.parse(localStorage.getItem(oldStatsKey(petKey))||"null");
        if(old){
          s = {
            food: clamp(100-Number(old.hunger||0)),
            happy: clamp(old.happy ?? 85),
            energy: clamp(old.energy ?? 80),
            clean: clamp(old.clean ?? 90),
            updatedAt: old.updatedAt || Date.now()
          };
        }
      }catch(e){}
    }

    if(!s) s=defaultStats();

    const now=Date.now();
    const hours=Math.max(0,(now-(s.updatedAt||now))/3600000);

    // Scad încet cât timp aplicația este închisă.
    s.food=clamp(Number(s.food||0)-hours*2.2);
    s.happy=clamp(Number(s.happy||0)-hours*.9);
    s.energy=clamp(Number(s.energy||0)-hours*1.1);
    s.clean=clamp(Number(s.clean||0)-hours*.7);
    s.updatedAt=now;

    saveStats(petKey,s);
    recordCareIfEligible(s);
    return s;
  }

  function statText(v){
    v=clamp(v);
    return v>=100 ? "FULL" : v+"%";
  }

  function getMissionState(){
    const today=todayKey();
    let state=null;
    try{
      state=JSON.parse(localStorage.getItem(K.mission)||"null");
    }catch(e){}

    if(!state || state.date!==today){
      state={
        date:today,
        progress:{
          feed:0,
          play:0,
          wash:0,
          sleep:0,
          buyFood:0,
          care:0
        },
        claimed:{}
      };
      saveMissionState(state);
    }

    state.progress=Object.assign({
      feed:0,play:0,wash:0,sleep:0,buyFood:0,care:0
    },state.progress||{});
    state.claimed=state.claimed||{};
    return state;
  }

  function saveMissionState(state){
    localStorage.setItem(K.mission,JSON.stringify(state));
  }

  function recordAction(id,amount=1){
    const state=getMissionState();
    const def=MISSION_DEFS.find(m=>m.id===id);
    if(!def) return state;
    state.progress[id]=Math.min(def.goal,Number(state.progress[id]||0)+Number(amount||0));
    saveMissionState(state);
    return state;
  }

  function recordCareIfEligible(stats){
    if(
      Number(stats.food)>=80 &&
      Number(stats.happy)>=80 &&
      Number(stats.energy)>=80 &&
      Number(stats.clean)>=80
    ){
      const state=getMissionState();
      state.progress.care=1;
      saveMissionState(state);
    }
  }

  function claimMission(id){
    const state=getMissionState();
    const def=MISSION_DEFS.find(m=>m.id===id);
    if(!def) return {ok:false,message:"Misiune necunoscută."};
    if(state.claimed[id]) return {ok:false,message:"Ai luat deja recompensa."};
    if(Number(state.progress[id]||0)<def.goal){
      return {ok:false,message:"Misiunea nu este terminată încă."};
    }

    state.claimed[id]=true;
    saveMissionState(state);
    addCoins(def.coins);
    addHearts(def.hearts);
    return {ok:true,message:`+${def.coins} monede și +${def.hearts} inimioare ❤️`};
  }

  window.DuoPet = {
    K,PETS,MISSION_DEFS,
    selectedPet,
    getCoins,setCoins,addCoins,spendCoins,
    getHearts,addHearts,
    getInventory,saveInventory,addInventory,useInventory,
    getStats,saveStats,statText,clamp,
    getMissionState,saveMissionState,recordAction,recordCareIfEligible,claimMission
  };
})();
