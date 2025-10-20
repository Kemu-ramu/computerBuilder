// ====== App Initializer: スタイルと基本レイアウトを注入 ======
class AppInitializer {
  static loadStyles() {
    // Bootstrap CSS CDNの<link>タグを生成して<head>に追加
    const bootstrapLink = document.createElement('link');
    bootstrapLink.rel = 'stylesheet';
    bootstrapLink.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
    bootstrapLink.integrity = 'sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z';
    bootstrapLink.crossOrigin = 'anonymous';
    document.head.appendChild(bootstrapLink);

    // 分割した外部CSSファイル(styles.css)への<link>タグを生成して<head>に追加
    const customLink = document.createElement('link');
    customLink.rel = 'stylesheet';
    customLink.href = 'styles.css';
    document.head.appendChild(customLink);
  }

  static renderBaseLayout() {
    // ページの基本構造（ヘッダー、メイン、フッター）を<body>に描画
    document.body.innerHTML = `
      <header class="header">
        <div class="jumbotron jumbotron-fluid mb-0">
          <div class="container">
            <h1 class="display-4">Computer Builder</h1>
            <p class="lead">CPU / GPU / RAM / Storage を選んで、Gaming / Work スコアを比較します。</p>
          </div>
        </div>
      </header>

      <main class="container py-5" id="target"></main>

      <footer class="footer mt-auto py-3 bg-light">
        <div class="container">
          <span class="text-muted">&copy; 2025 Computer Builder</span>
        </div>
      </footer>
    `;
    
    // BootstrapのJavaScriptライブラリを動的に読み込み
    const scripts = [
      'https://code.jquery.com/jquery-3.5.1.slim.min.js',
      'https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js',
      'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js'
    ];
    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    });
  }
}

// ====== Config ======
const config = {
  // `parent`はレイアウト描画後に設定される
  parent: null, 
  url: "https://api.recursionist.io/builder/computers?type=",
  cpu:{ brand: "#cpuBrand", model: "#cpuModel" },
  gpu:{ brand: "#gpuBrand", model: "#gpuModel" },
  ram:{ num: "#ramNum", brand: "#ramBrand", model: "#ramModel" },
  storage:{ type: "#storageType", size: "#storageSize", brand: "#storageBrand", model: "#storageModel" }
};

// ====== Model ======
class PC{
  constructor(){
    this.cpuBrand = null; this.cpuModel = null; this.cpuBenchmark = null;
    this.gpuBrand = null; this.gpuModel = null; this.gpuBenchmark = null;
    this.ramBrand = null; this.ramModel = null; this.ramBenchmark = null;
    this.storageType = null; this.storageSize = null; this.storageBrand = null; this.storageModel = null; this.storageBenchmark = null;
  }
  static addBrandData(parts, selectedBrand, pc){
    switch(parts){
      case "cpu": pc.cpuBrand = selectedBrand; break;
      case "gpu": pc.gpuBrand = selectedBrand; break;
      case "ram": pc.ramBrand = selectedBrand; break;
      case "hdd": case "ssd": pc.storageBrand = selectedBrand; break;
    }
  }
  static addModelData(parts, selectedModel, pc){
    switch(parts){
      case "cpu": pc.cpuModel = selectedModel; break;
      case "gpu": pc.gpuModel = selectedModel; break;
      case "ram": pc.ramModel = selectedModel; break;
      case "hdd": case "ssd": pc.storageModel = selectedModel; break;
    }
  }
  static addBenchmarkData(parts, benchmark, pc){
    switch(parts){
      case "cpu": pc.cpuBenchmark = benchmark; break;
      case "gpu": pc.gpuBenchmark = benchmark; break;
      case "ram": pc.ramBenchmark = benchmark; break;
      case "hdd": case "ssd": pc.storageBenchmark = benchmark; break;
    }
  }
  static addStorageSizeData(size, pc){ pc.storageSize = size; }

  static getGamingBenchmark(pc){
    const cpuScore = parseInt(pc.cpuBenchmark * 0.25);
    const gpuScore = parseInt(pc.gpuBenchmark * 0.6);
    const ramScore = parseInt(pc.ramBenchmark * 0.125);
    const storageFactor = pc.storageType === "SSD" ? 0.1 : 0.025;
    const storageScore = parseInt(pc.storageBenchmark * storageFactor);
    return cpuScore + gpuScore + ramScore + storageScore;
  }
  static getWorkBenchmark(pc){
    const cpuScore = parseInt(pc.cpuBenchmark * 0.6);
    const gpuScore = parseInt(pc.gpuBenchmark * 0.25);
    const ramScore = parseInt(pc.ramBenchmark * 0.1);
    const storageScore = parseInt(pc.storageBenchmark * 0.05);
    return cpuScore + gpuScore + ramScore + storageScore;
  }
}

// ====== View ======
class View{
  static createInitialPage(pc){
    // config.parentはControllerによって設定済み
    const parent = config.parent;
    const card = document.createElement("div");
    card.className = "card shadow-sm";
    
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    cardBody.innerHTML = `
      <h5 class="card-title">Step 1: CPU</h5>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="cpuBrand">Brand</label>
          <select id="cpuBrand" class="form-control"><option selected>-</option></select>
        </div>
        <div class="form-group col-md-6">
          <label for="cpuModel">Model</label>
          <select id="cpuModel" class="form-control"><option selected>-</option></select>
        </div>
      </div>
      <hr>

      <h5 class="card-title mt-4">Step 2: GPU</h5>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="gpuBrand">Brand</label>
          <select id="gpuBrand" class="form-control"><option selected>-</option></select>
        </div>
        <div class="form-group col-md-6">
          <label for="gpuModel">Model</label>
          <select id="gpuModel" class="form-control"><option selected>-</option></select>
        </div>
      </div>
      <hr>

      <h5 class="card-title mt-4">Step 3: RAM</h5>
      <div class="form-row">
        <div class="form-group col-md-4">
          <label for="ramNum">How many?</label>
          <select id="ramNum" class="form-control">
            <option selected>-</option><option>1</option><option>2</option><option>3</option><option>4</option>
          </select>
        </div>
        <div class="form-group col-md-4">
          <label for="ramBrand">Brand</label>
          <select id="ramBrand" class="form-control"><option selected>-</option></select>
        </div>
        <div class="form-group col-md-4">
          <label for="ramModel">Model</label>
          <select id="ramModel" class="form-control"><option selected>-</option></select>
        </div>
      </div>
      <hr>
      
      <h5 class="card-title mt-4">Step 4: Storage</h5>
      <div class="form-row">
        <div class="form-group col-md-3">
          <label for="storageType">HDD / SSD</label>
          <select id="storageType" class="form-control"><option selected>-</option><option>HDD</option><option>SSD</option></select>
        </div>
        <div class="form-group col-md-3">
          <label for="storageSize">Capacity</label>
          <select id="storageSize" class="form-control"><option selected>-</option></select>
        </div>
        <div class="form-group col-md-3">
          <label for="storageBrand">Brand</label>
          <select id="storageBrand" class="form-control"><option selected>-</option></select>
        </div>
        <div class="form-group col-md-3">
          <label for="storageModel">Model</label>
          <select id="storageModel" class="form-control"><option selected>-</option></select>
        </div>
      </div>

      <div class="d-flex align-items-center mt-4">
        <button type="button" class="btn btn-primary btn-lg" id="addPc">Add PC</button>
        <small class="form-text text-danger ml-3">※すべての項目を選択してから追加してください。</small>
      </div>

      <hr class="my-4" />
      <div id="displayPC" class="row"></div>
    `;
    card.append(cardBody);
    parent.append(card);

    const addPcBtn = document.getElementById("addPc");
    addPcBtn.addEventListener("click", function(){ Controller.clickAddPc(pc); });
    return parent;
  }

  static createbuiltPcPage(pc, gamingScore, workScore, count){
    const container = document.getElementById("displayPC");
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6 mb-4";
    col.innerHTML = `
      <div class="card h-100">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">Your PC ${count}</h5>
          <p class="card-text mb-2"><small class="text-muted">CPU</small><br>${pc.cpuBrand} — ${pc.cpuModel}</p>
          <p class="card-text mb-2"><small class="text-muted">GPU</small><br>${pc.gpuBrand} — ${pc.gpuModel}</p>
          <p class="card-text mb-2"><small class="text-muted">RAM</small><br>${pc.ramBrand} — ${pc.ramModel}</p>
          <p class="card-text mb-2"><small class="text-muted">Storage</small><br>${pc.storageBrand} — ${pc.storageModel} (${pc.storageType}, ${pc.storageSize})</p>

          <div class="mt-auto pt-3">
            <div class="d-flex justify-content-between align-items-center">
              <span>Gaming</span>
              <span class="font-weight-bold">${gamingScore}%</span>
            </div>
            <div class="progress">
              <div class="progress-bar" role="progressbar" style="width: ${Math.min(gamingScore, 100)}%;" aria-valuenow="${gamingScore}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-2">
              <span>Work</span>
              <span class="font-weight-bold">${workScore}%</span>
            </div>
            <div class="progress">
              <div class="progress-bar bg-success" role="progressbar" style="width: ${Math.min(workScore, 100)}%;" aria-valuenow="${workScore}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    container.append(col);
    return container;
  }
}

// ====== Controller ======
class Controller{
  static count = 0;
  static startBuildComputer(){
    // 1. スタイルと基本レイアウトを描画
    AppInitializer.loadStyles();
    AppInitializer.renderBaseLayout();

    // 2. メインコンテンツの描画先（#target）をconfigに設定
    config.parent = document.getElementById("target");

    // 3. アプリケーションのコア機能を開始
    const pc = new PC();
    View.createInitialPage(pc);
    Controller.getAllData(pc);
  }
  static getAllData(pc){
    const cpuBrandOp = document.querySelector(config.cpu.brand);
    const cpuModelOp = document.querySelector(config.cpu.model);
    const gpuBrandOp = document.querySelector(config.gpu.brand);
    const gpuModelOp = document.querySelector(config.gpu.model);
    const ramBrandOp = document.querySelector(config.ram.brand);
    const ramModelOp = document.querySelector(config.ram.model);
    const storageBrandOp = document.querySelector(config.storage.brand);
    const storageModelOp = document.querySelector(config.storage.model);

    Controller.getBrandData("cpu", cpuBrandOp, cpuModelOp, pc);
    Controller.getBrandData("gpu", gpuBrandOp, gpuModelOp, pc);
    Controller.getRamData(ramBrandOp, ramModelOp, pc);
    Controller.getStorageData(storageBrandOp, storageModelOp, pc);
  }
  static getBrandData(parts, brandOp, modelOp, pc){
    fetch(config.url + parts).then(r => r.json()).then(data => {
      brandOp.innerHTML = `<option selected>-</option>`;
      const brandData = Controller.getBrand(data);
      const modelData = Controller.getModel(data);
      const benchmarkData = Controller.getBenchmark(data);
      for(const brand in brandData){
        const option = document.createElement("option");
        option.value = brandData[brand];
        option.textContent = brandData[brand];
        brandOp.append(option);
      }
      brandOp.addEventListener("change", function(){
        Controller.getModelData(parts, brandOp, modelOp, modelData, benchmarkData, pc);
      });
    });
  }
  static getModelData(parts, brandOp, modelOp, modelData, benchmarkData, pc){
    fetch(config.url + parts).then(r => r.json()).then(() => {
      modelOp.innerHTML = `<option selected>-</option>`;
      const selectedBrand = brandOp.value;
      PC.addBrandData(parts, selectedBrand, pc);
      if(parts === "hdd" || parts === "ssd"){
        const storageSizeOp = document.querySelector(config.storage.size);
        const selectedSize = storageSizeOp.value;
        const filteredStorageModel = Controller.filterStorageModel(selectedSize, modelData[selectedBrand]);
        Controller.addOptionList(filteredStorageModel, modelOp);
      }else if(parts === "ram"){
        const ramNumOp = document.querySelector(config.ram.num);
        const selectedNumber = ramNumOp.value;
        const filteredRamModel = Controller.filterRamModel(selectedNumber, modelData[selectedBrand]);
        Controller.addOptionList(filteredRamModel, modelOp);
      }else{
        Controller.addOptionList(modelData[selectedBrand], modelOp);
      }
      modelOp.addEventListener("change", function(){
        const selectedModel = modelOp.value;
        const selectedBenchmark = benchmarkData[selectedModel];
        PC.addModelData(parts, selectedModel, pc);
        PC.addBenchmarkData(parts, selectedBenchmark, pc);
      });
    });
  }
  static getRamData(ramBrandOp, ramModelOp, pc){
    const ramNumOp = document.querySelector(config.ram.num);
    ramNumOp.addEventListener("change", function(){
      ramBrandOp.innerHTML = `<option selected>-</option>`;
      ramModelOp.innerHTML = `<option selected>-</option>`;
      Controller.getBrandData("ram", ramBrandOp, ramModelOp, pc);
    });
  }
  static getStorageData(storageBrandOp, storageModelOp, pc){
    const storageTypeOp = document.querySelector(config.storage.type);
    const storageSizeOp = document.querySelector(config.storage.size);
    storageTypeOp.addEventListener("change", function(){
      storageSizeOp.innerHTML = `<option selected>-</option>`;
      storageBrandOp.innerHTML = `<option selected>-</option>`;
      storageModelOp.innerHTML = `<option selected>-</option>`;

      const selectedStorageType = storageTypeOp.value;
      pc.storageType = selectedStorageType;
      if (selectedStorageType === "-") return;

      const partType = (selectedStorageType === "HDD") ? "hdd" : "ssd";
      Controller.getStorageSizeData(partType);
      storageSizeOp.addEventListener("change", function(){
        storageBrandOp.innerHTML = `<option selected>-</option>`;
        storageModelOp.innerHTML = `<option selected>-</option>`;
        const selectedSize = storageSizeOp.value;
        PC.addStorageSizeData(selectedSize, pc);
        Controller.getBrandData(partType, storageBrandOp, storageModelOp, pc);
      });
    });
  }
  static addOptionList(arr, op){
    if(!arr) return;
    arr.forEach(word => {
      const option = document.createElement("option");
      option.value = word; option.textContent = word; op.append(option);
    });
  }
  static getStorageSizeData(type){
    fetch(config.url + type).then(r => r.json()).then(data => {
      const storageSizeOp = document.querySelector(config.storage.size);
      const storagemodelData = Controller.getStorageModel(data);
      const storageSizeList = Controller.getStorageSizeList(storagemodelData);
      Controller.addOptionList(storageSizeList, storageSizeOp);
    });
  }
  static getStorageSizeList(storageModelData){
    const storageModelList = Object.keys(storageModelData);
    const tb = [], gb = [];
    storageModelList.forEach(model =>{
      if(model.includes("TB")) tb.push(parseFloat(model.replace("TB","")));
      else gb.push(parseFloat(model.replace("GB","")));
    });
    const sortedTb = tb.sort((a,b)=>a-b).map(x=>x+"TB");
    const sortedGb = gb.sort((a,b)=>a-b).map(x=>x+"GB");
    return sortedGb.concat(sortedTb);
  }
  static getBrand(data){
    const brandData = {}; for(const i in data){ const cur = data[i]; if(brandData[cur.Brand] === undefined) brandData[cur.Brand] = cur.Brand; }
    return brandData;
  }
  static getModel(data){
    const modelData = {}; for(const i in data){ const cur = data[i]; if(modelData[cur.Brand] === undefined) modelData[cur.Brand] = [cur.Model]; else modelData[cur.Brand].push(cur.Model); }
    return modelData;
  }
  static getBenchmark(data){
    const benchmarkData = {}; for(const i in data){ const cur = data[i]; if(benchmarkData[cur.Model] === undefined) benchmarkData[cur.Model] = cur.Benchmark; }
    return benchmarkData;
  }
  static getStorageModel(data){
    const modelData = {}; for(const i in data){ const cur = Controller.getStorageSizeString(data[i].Model); if(modelData[cur] === undefined) modelData[cur] = cur; }
    return modelData;
  }
  static getStorageSizeString(storageModel){
    return storageModel.split(' ').filter(w => w.includes("GB") || w.includes("TB")).join('');
  }
  static filterStorageModel(size, storageModelData){
    const storageModelList = Object.values(storageModelData||{});
    return storageModelList.filter(word => word.includes(' ' + size));
  }
  static filterRamModel(number, ramModelData){
    const ramModelList = Object.values(ramModelData||{});
    return ramModelList.filter(word => word.includes(number + 'x'));
  }
  static clickAddPc(pc){
    const modelList = [pc.cpuModel, pc.gpuModel, pc.ramModel, pc.storageModel];
    for(let i=0;i<modelList.length;i++){ if(!modelList[i]) return alert("すべての項目を選択してください。"); }
    const gamingScore = PC.getGamingBenchmark(pc);
    const workScore = PC.getWorkBenchmark(pc);
    Controller.count++;
    return View.createbuiltPcPage(pc, gamingScore, workScore, Controller.count);
  }
}

// ====== アプリケーションの実行 ======
Controller.startBuildComputer();