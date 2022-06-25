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
  next_button.disabled = true;
  hideNextButton();
}

function enableNextButton() {
  next_button.disabled = false;
  showNextButton();
}

async function init(next_button) {}

async function getSourceCode(nextID) {
  ret = fetch("http://localhost:3080/api/source?id=" + String(nextID), {
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
  ret = fetch("http://localhost:3080/api/next?user=" + user, {
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

function post(xhr,local_url,result){
    xhr.open('POST',local_url+"/result?id=7&user=wata -d '"+result+"'");
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhr.send(result);
}

function updateAns(ans) {
  document.getElementById("selected_ans").innerHTML = ans;
}

// async function updateSourceCode

window.addEventListener("load", function () {
  // document.getElementById('src2').innerHTML='<pre class="line-numbers"><code class="language-Java" id="src2">System.out.println()</code></pre>';
  const next_button = document.querySelector("#next_button");
  // next_button.disabled = true;
  const same_button = document.querySelector("#same_button");
  const diff_button = document.querySelector("#diff_button");
  const unknow_button = document.querySelector("#unknow_button");

  const local_url = "http://localhost:3080/api/";

  init(next_button);

  let xhr = new XMLHttpRequest();

  // hideNextButton();

  let ret;

  same_button.addEventListener("click", () => {
    enableNextButton();
    updateAns("Same");
    ret = "o";
  });

  diff_button.addEventListener("click", () => {
    enableNextButton();
    updateAns("Differ");
    ret = "x";
  });

  unknow_button.addEventListener("click", () => {
    enableNextButton();
    updateAns("Unknown");
    ret = "k";
  });

  ready_button.addEventListener("click",async ()=>{
    this.document.getElementById("title").style.visibility="hidden";
    this.document.getElementById("ans_buttons").style.visibility="visible";
    this.document.getElementById("program_field").style.visibility="visible";


    let user_name = document.getElementById("user_name").value;

    // ここにPOSTの処理を挟む
    post(xhr,local_url,ret);

    let nextID = await getNextID(user_name);
    updateSourceID(nextID);
    let res = await getSourceCode(nextID);
    let src1 = res["code1"];
    let src2 = res["code2"];
    let code1 = Prism.highlight(src1, Prism.languages.java, "java");
    let code2 = Prism.highlight(src2, Prism.languages.java, "java");
    document.getElementById("source_code1").innerHTML = code1;
    document.getElementById("source_code2").innerHTML = code2;
    updateAns("");

    disableNextButton();
  });

  next_button.addEventListener("click", async () => {
    let user_name = document.getElementById("user_name").value;

    // ここにPOSTの処理を挟む
    post(xhr,local_url,ret);

    let nextID = await getNextID(user_name);
    updateSourceID(nextID);
    let res = await getSourceCode(nextID);
    let src1 = res["code1"];
    let src2 = res["code2"];
    let code1 = Prism.highlight(src1, Prism.languages.java, "java");
    let code2 = Prism.highlight(src2, Prism.languages.java, "java");
    document.getElementById("source_code1").innerHTML = code1;
    document.getElementById("source_code2").innerHTML = code2;
    updateAns("");

    disableNextButton();
  });
});
