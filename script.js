window.addEventListener('load', function() {
    
    // document.getElementById('src2').innerHTML='<pre class="line-numbers"><code class="language-Java" id="src2">System.out.println()</code></pre>';
    const source_id = document.getElementById('source_id');
    const next_button = document.querySelector("#next_button");
    next_button.disabled = true;
    const same_button = document.querySelector("#same_button");
    const diff_button = document.querySelector("#diff_button");
    const unknow_button = document.querySelector("#unknow_button");

    same_button.addEventListener("click",()=>{
        const src = 'if (true) System.out.println();';
        let code = Prism.highlight(src,Prism.languages.java,'java');
        document.getElementById('source_code1').innerHTML= code;
        console.log(code);
    });

    next_button.addEventListener("click",() => {
        source_id.innerHTML = "5";
    });
});