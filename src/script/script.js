const local_url = `${window.location.protocol}//${window.location.host}${window.location.pathname}api/`;
const xhr = new XMLHttpRequest();

const a = 0;

let currentSrcID;
let selected_ans;
let is_next_active = false;



function hideNextButton() {
  document.getElementById("next_button").style.opacity = 0.3;
}
function showNextButton() {
  document.getElementById("next_button").style.opacity = 1.0;
}

function updateSourceID(id) {
  const source_id = document.getElementById("source_id");
  source_id.innerHTML = String(id);
}

function disableNextButton() {
  is_next_active = false;
  next_button.disabled = true;
  hideNextButton();
}

function enableNextButton() {
  is_next_active = true;
  next_button.disabled = false;
  showNextButton();
}

async function init(next_button) {}

async function getSourceCode(nextID) {
  ret = fetch(`${window.location.protocol}//${window.location.host}${window.location.pathname}api/source?id=${nextID}`, {
    mode: "cors",
  })
    .then((response) => {
      if (!response.ok) {
        console.log("NODATA");
        throw new Error();
      }
      return response.json();
    })
    .then((data) => {
      return data;
    });
  return ret;
}

async function getNextID(user) {
  ret = fetch(`${window.location.protocol}//${window.location.host}${window.location.pathname}api/next?user=${user}`, {
    mode: "cors",
  })
    .then((response) => {
      if (!response.ok) {
        console.log("NODATA");
        throw new Error();
      }
      return response.json();
    })
    .then((data) => {
      return data;
    });
  return ret;
}

async function post(result){
  let data = "o";
  let form = new FormData();
  let user_name = document.getElementById("user_name").value;

  console.log(`${window.location.protocol}//${window.location.host}${window.location.pathname}api/result?id=${currentSrcID}&user=${user_name}&judge=${result}`);
  
  
  return fetch(`${window.location.protocol}//${window.location.host}${window.location.pathname}api/result?id=${currentSrcID}&user=${user_name}&judge=${result}`,{
    method: "POST"
  }).then(res => {
  console.log("posted");
return 'post end'  });
}

function updateAns(ans) {
  document.getElementById("selected_ans").innerHTML = ans;
}

function resizeFontSize(size){
  document.documentElement.style.fontSize = size;
}

function sameSelected(){
  enableNextButton();
    updateAns("Same");
    selected_ans = "o";
}

function diffSelected(){
  enableNextButton();
  updateAns("Differ");
  selected_ans = "x";
}

function unknownSelected(){
  enableNextButton();
  updateAns("Unknown");
  selected_ans = "k";
}

async function nextSelected(){
  let user_name = document.getElementById("user_name").value;

  const local_url = `${window.location.protocol}//${window.location.host}${window.location.pathname}api/`;

  // ここにPOSTの処理を挟む
  await post(selected_ans);

  currentSrcID = await getNextID(user_name);
  console.log(currentSrcID);
  updateSourceID(currentSrcID);
  let res = await getSourceCode(currentSrcID);
  let src1 = res["code1"];
  let src2 = res["code2"];
  let code1 = Prism.highlight(src1, Prism.languages.java, "java");
  let code2 = Prism.highlight(src2, Prism.languages.java, "java");
  document.getElementById("source_code1").innerHTML = code1;
  document.getElementById("source_code2").innerHTML = code2;
  updateAns("");

  disableNextButton();
}

async function keyEvent(event,isKeyActive){
  if(! isKeyActive){
    return;
  }
  switch(event.key){
    case 'z':
      sameSelected();
    break;
    case 'x':
      diffSelected();
    break;
    case 'c':
      unknownSelected();
    break;
    case 'Enter':
      if(is_next_active){
        nextSelected();
      }
    break;
  }
}

// async function updateSourceCode

window.addEventListener("load", function () {
  const next_button = document.querySelector("#next_button");
  const same_button = document.querySelector("#same_button");
  const diff_button = document.querySelector("#diff_button");
  const unknow_button = document.querySelector("#unknow_button");

  const config_fontsize_bar = document.getElementById("config-fontsize-bar");
  config_fontsize_bar.addEventListener("input",()=>{
    resizeFontSize(config_fontsize_bar.value);
  });

  init(next_button);

  let isKeyActive = false;


  same_button.addEventListener("click", () => {
    sameSelected();
  });

  diff_button.addEventListener("click", () => {
    diffSelected();
  });

  unknow_button.addEventListener("click", () => {
    unknownSelected();
  });

  next_button.addEventListener("click", async () => {
    nextSelected();
  });

  this.document.addEventListener("keypress",(event) => {
    keyEvent(event,isKeyActive);
  });

  ready_button.addEventListener("click",async ()=>{
    this.document.getElementById("title").style.visibility="hidden";
    this.document.getElementById("ans_buttons").style.visibility="visible";
    this.document.getElementById("program_field").style.visibility="visible";


    let user_name = document.getElementById("user_name").value;


    currentSrcID = await getNextID(user_name);
    updateSourceID(currentSrcID);
    let res = await getSourceCode(currentSrcID);
    let src1 = res["code1"];
    let src2 = res["code2"];
    let code1 = Prism.highlight(src1, Prism.languages.java, "java");
    let code2 = Prism.highlight(src2, Prism.languages.java, "java");
    document.getElementById("source_code1").innerHTML = code1;
    document.getElementById("source_code2").innerHTML = code2;
    updateAns("");
    isKeyActive = true;

    disableNextButton();
  });
});
