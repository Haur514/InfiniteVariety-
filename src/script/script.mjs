import Prism from 'prismjs/prism';
import javaParser from 'prettier-plugin-java/dist/index';
import prettier from 'prettier/esm/standalone';
import 'prismjs/components/prism-java';



let currentSrcID;
let selected_ans;
let is_next_active = false;

// 進捗を取得
async function updateProgressRate(){
  let ratio = await getProgressRate("h-yosiok");
  // 全員のnextID表示しているヘッダ部分更新
  document.getElementById("h-watanb-prog").innerHTML = String(await getProgressRate("h-watanb"))
  document.getElementById("r-takaic-prog").innerHTML = String(await getProgressRate("r-takaic"))
  document.getElementById("h-yosiok-prog").innerHTML = String(await getProgressRate("h-yosiok"))
  
}
async function getProgressRate(user){
  let ret = fetch(`${window.location.protocol}//${window.location.host}${window.location.pathname}api/status?user=${user}`, {
    mode: "cors",
  }).then((response) => {
      if (!response.ok) {
        console.log("NODATA");
        throw new Error();
      }
      return response.json();
    })
    .then((data) => {
      return parseInt(data["answered"])/parseInt(data["toAnswer"])*100;
    }).then(function(value){
      return value;
    });
  return (await ret).toFixed(2);
}

async function src_id_selected(){
  let srcID = document.getElementById("selected_src_id").value;

  currentSrcID = srcID
  console.log(currentSrcID);
  updateSourceID(currentSrcID);
  let res = await getSourceCode(currentSrcID);
  let src1 = prettier.format(res["code1"], { parser: 'java', plugins: [javaParser], entrypoint: "methodDeclaration" });
  let src2 = prettier.format(res["code2"], { parser: 'java', plugins: [javaParser], entrypoint: "methodDeclaration" });
  let code1 = Prism.highlight(src1, Prism.languages.java, "java");
  let code2 = Prism.highlight(src2, Prism.languages.java, "java");
  document.getElementById("source_code1").innerHTML = code1;
  document.getElementById("source_code2").innerHTML = code2;
  updateAns("");

  updateProgressRate();

  disableNextButton();
}


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

function isUserSelectedCollectly(){
  let user_name = document.getElementById("user_name").value;
  if(user_name == ""){
    alert("ユーザを選択してください");
    return false;
  }
  return true;
}

async function init(next_button) {}

async function getSourceCode(nextID) {
  const ret = fetch(`${window.location.protocol}//${window.location.host}${window.location.pathname}api/source?id=${nextID}`, {
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
  const ret = fetch(`${window.location.protocol}//${window.location.host}${window.location.pathname}api/next?user=${user}`, {
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
  updateHistory(user_name,currentSrcID,selected_ans);

  // ここにPOSTの処理を挟む
  await post(selected_ans);

  currentSrcID = await getNextID(user_name);
  console.log(currentSrcID);
  updateSourceID(currentSrcID);
  let res = await getSourceCode(currentSrcID);
  let src1 = prettier.format(res["code1"], { parser: 'java', plugins: [javaParser], entrypoint: "methodDeclaration" });
  let src2 = prettier.format(res["code2"], { parser: 'java', plugins: [javaParser], entrypoint: "methodDeclaration" });
  let code1 = Prism.highlight(src1, Prism.languages.java, "java");
  let code2 = Prism.highlight(src2, Prism.languages.java, "java");
  document.getElementById("source_code1").innerHTML = code1;
  document.getElementById("source_code2").innerHTML = code2;
  updateAns("");

  updateProgressRate();

  disableNextButton();
}

function updateHistory(user_name,srcID,ans){
  const his = `{user_name:{${user_name}}   srcID:{${srcID}}   ans:{${ans}} date:{${new Date().toLocaleString()}}},<br>`;
  document.getElementById("ans-history").innerHTML += his;
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

async function readySelected(){
  document.getElementById("title").style.visibility="hidden";
  document.getElementById("ans_buttons").style.visibility="visible";
  document.getElementById("program_field").style.visibility="visible";


  updateProgressRate();
  let user_name = document.getElementById("user_name").value;

  switch(user_name){
    case "h-watanb":
      document.getElementById("h-watanb-curnum").style.backgroundColor = "#ffffbf";
    break;
    case "r-takaic":
      document.getElementById("r-takaic-curnum").style.backgroundColor = "#ffffbf";
    break;

    case"h-yosiok":
    document.getElementById("h-yosiok-curnum").style.backgroundColor = "#ffffbf";
    break;
  }

  currentSrcID = await getNextID(user_name);
  updateSourceID(currentSrcID);
  let res = await getSourceCode(currentSrcID);
  let src1 = prettier.format(res["code1"], { parser: 'java', plugins: [javaParser], entrypoint: "methodDeclaration" });
  let src2 = prettier.format(res["code2"], { parser: 'java', plugins: [javaParser], entrypoint: "methodDeclaration" });
  let code1 = Prism.highlight(src1, Prism.languages.java, "java");
  let code2 = Prism.highlight(src2, Prism.languages.java, "java");
  document.getElementById("source_code1").innerHTML = code1;
  document.getElementById("source_code2").innerHTML = code2;
  updateAns("");
  disableNextButton();
}

// async function updateSourceCode

window.addEventListener("load", function () {
  const next_button = document.querySelector("#next_button");
  const same_button = document.querySelector("#same_button");
  const diff_button = document.querySelector("#diff_button");
  const unknow_button = document.querySelector("#unknow_button");
  const src_select_button = document.querySelector("#select_src_id_button")

  const config_fontsize_bar = document.getElementById("config-fontsize-bar");
  config_fontsize_bar.addEventListener("input",()=>{
    resizeFontSize(config_fontsize_bar.value);
  });

  init(next_button);

  let isKeyActive = false;

  src_select_button.addEventListener("click",()=>{
    src_id_selected();
  }); 

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
    if(isUserSelectedCollectly()){
      readySelected();
      isKeyActive = true;
    }
  });
});
