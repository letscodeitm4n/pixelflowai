export const PLAYGROUND_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PixelFlow AI — High-Speed Image Processing API</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(18, 24, 38, 0.75);
      --card-border: rgba(255, 255, 255, 0.08);
      --accent: #6366f1;
      --accent-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
      --accent-glow: rgba(99, 102, 241, 0.35);
      --green: #10b981;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --radius: 16px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Outfit', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-image: 
        radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 85% 85%, rgba(236, 72, 153, 0.12) 0%, transparent 40%);
    }

    header {
      padding: 20px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--card-border);
      backdrop-filter: blur(12px);
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: var(--accent-gradient);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-weight: 800;
      font-size: 20px;
      box-shadow: 0 0 20px var(--accent-glow);
    }

    .logo-text {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .badge {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .status-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--text-muted);
    }

    .dot {
      width: 8px;
      height: 8px;
      background: var(--green);
      border-radius: 50%;
      box-shadow: 0 0 10px var(--green);
    }

    main {
      flex: 1;
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 40px 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }

    @media (max-width: 968px) {
      main { grid-template-columns: 1fr; }
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--radius);
      padding: 28px;
      backdrop-filter: blur(16px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    }

    .card-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .dropzone {
      border: 2px dashed rgba(255, 255, 255, 0.2);
      border-radius: 14px;
      padding: 40px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.03);
      margin-bottom: 24px;
    }

    .dropzone:hover, .dropzone.dragover {
      border-color: var(--accent);
      background: rgba(99, 102, 241, 0.08);
      transform: translateY(-2px);
    }

    .dropzone-icon {
      font-size: 42px;
      margin-bottom: 12px;
    }

    .dropzone-text {
      font-size: 15px;
      color: var(--text-muted);
    }

    .dropzone-text strong {
      color: var(--text);
    }

    .input-group {
      margin-bottom: 20px;
    }

    .label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    input[type="text"], input[type="number"], select {
      width: 100%;
      padding: 12px 16px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      color: var(--text);
      font-family: inherit;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    input[type="text"]:focus, select:focus {
      border-color: var(--accent);
    }

    .tabs {
      display: flex;
      gap: 8px;
      background: rgba(0,0,0,0.3);
      padding: 6px;
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .tab {
      flex: 1;
      padding: 12px;
      text-align: center;
      border: none;
      background: transparent;
      color: var(--text-muted);
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab.active {
      background: var(--accent-gradient);
      color: white;
      box-shadow: 0 4px 12px var(--accent-glow);
    }

    .service-panel { display: none; }
    .service-panel.active { display: block; }

    .slider-container {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    input[type="range"] {
      flex: 1;
      accent-color: var(--accent);
    }

    .btn {
      width: 100%;
      padding: 16px;
      background: var(--accent-gradient);
      border: none;
      border-radius: 12px;
      color: white;
      font-family: inherit;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      box-shadow: 0 4px 20px var(--accent-glow);
      transition: transform 0.1s, opacity 0.2s;
      margin-top: 10px;
    }

    .btn:hover { opacity: 0.95; }
    .btn:active { transform: scale(0.99); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .preview-box {
      width: 100%;
      height: 320px;
      background: rgba(0,0,0,0.4);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      display: grid;
      place-items: center;
      overflow: hidden;
      position: relative;
      margin-bottom: 24px;
    }

    .preview-box img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .placeholder-text {
      color: var(--text-muted);
      font-size: 14px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: rgba(0,0,0,0.25);
      border: 1px solid var(--card-border);
      padding: 14px;
      border-radius: 10px;
      text-align: center;
    }

    .stat-val {
      font-size: 16px;
      font-weight: 700;
      color: var(--green);
    }

    .stat-label {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .json-output {
      background: rgba(0,0,0,0.5);
      border: 1px solid var(--card-border);
      padding: 16px;
      border-radius: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #a7f3d0;
      max-height: 180px;
      overflow-y: auto;
      white-space: pre-wrap;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255,255,255,0.2);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>

  <header>
    <div class="logo-container">
      <div class="logo-icon">PF</div>
      <div>
        <div class="logo-text">PixelFlow AI</div>
      </div>
      <span class="badge">x402 Protocol Active ($0.001 USDT)</span>
    </div>
    <div class="status-pill">
      <span class="dot"></span> Server Live
    </div>
  </header>

  <main>
    <div class="card">
      <div class="card-title">📁 Upload Image</div>

      <div class="dropzone" id="dropzone">
        <div class="dropzone-icon">📥</div>
        <div class="dropzone-text"><strong>Click to select image</strong> or drag & drop file</div>
        <input type="file" id="fileInput" accept="image/*" style="display:none">
      </div>

      <div class="card-title">⚙️ Choose Service</div>

      <div class="tabs">
        <button class="tab active" data-service="compress">Compress</button>
        <button class="tab" data-service="convert">Convert</button>
        <button class="tab" data-service="resize">Resize</button>
      </div>

      <div id="panel-compress" class="service-panel active">
        <div class="input-group">
          <label class="label">Output Format</label>
          <select id="compressFormat">
            <option value="auto" selected>Original Format</option>
            <option value="webp">WebP (High Compression)</option>
            <option value="avif">AVIF (Ultra Compression)</option>
          </select>
        </div>
        <div class="input-group">
          <label class="label">Quality: <span id="qualityVal">75</span>%</label>
          <div class="slider-container">
            <input type="range" id="qualityRange" min="10" max="100" value="75">
          </div>
        </div>
      </div>

      <div id="panel-convert" class="service-panel">
        <div class="input-group">
          <label class="label">Target Output Format</label>
          <select id="convertFormat">
            <option value="webp">WebP</option>
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="avif">AVIF</option>
          </select>
        </div>
      </div>

      <div id="panel-resize" class="service-panel">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="input-group">
            <label class="label">Width (px)</label>
            <input type="number" id="resizeWidth" value="500" placeholder="e.g. 500">
          </div>
          <div class="input-group">
            <label class="label">Height (px)</label>
            <input type="number" id="resizeHeight" value="500" placeholder="e.g. 500">
          </div>
        </div>
        <div class="input-group">
          <label class="label">Fit Mode</label>
          <select id="resizeFit">
            <option value="cover">Cover (Crop to fill)</option>
            <option value="contain">Contain (Fit inside)</option>
            <option value="fill">Fill (Stretch)</option>
          </select>
        </div>
      </div>

      <button class="btn" id="runBtn">Process & Deliver Image 🚀</button>
    </div>

    <div class="card">
      <div class="card-title">✨ Output Preview</div>

      <div class="preview-box" id="previewBox">
        <span class="placeholder-text">Upload an image and click Process</span>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-val" id="statSize">-</div>
          <div class="stat-label">Delivered Size</div>
        </div>
        <div class="stat-card">
          <div class="stat-val" id="statType">-</div>
          <div class="stat-label">Content-Type</div>
        </div>
        <div class="stat-card">
          <div class="stat-val" id="statSpeed">-</div>
          <div class="stat-label">Response Time</div>
        </div>
      </div>

      <div class="card-title" style="font-size: 14px; margin-bottom: 10px;">📄 Protocol Response</div>
      <div class="json-output" id="jsonOutput">Select an image to start processing.</div>
    </div>
  </main>

  <script>
    let activeService = 'compress';
    let loadedBase64 = null;

    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) handleFile(e.target.files[0]);
    });

    function handleFile(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        loadedBase64 = e.target.result;
        dropzone.querySelector('.dropzone-text').innerHTML = \`<strong>Loaded:</strong> \${file.name} (\${(file.size / 1024).toFixed(1)} KB)\`;
      };
      reader.readAsDataURL(file);
    }

    const qualityRange = document.getElementById('qualityRange');
    const qualityVal = document.getElementById('qualityVal');
    qualityRange.addEventListener('input', (e) => qualityVal.textContent = e.target.value);

    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.service-panel').forEach(p => p.classList.remove('active'));
        
        tab.classList.add('active');
        activeService = tab.dataset.service;
        document.getElementById(\`panel-\${activeService}\`).classList.add('active');
      });
    });

    document.getElementById('runBtn').addEventListener('click', async () => {
      const runBtn = document.getElementById('runBtn');
      const jsonOutput = document.getElementById('jsonOutput');
      const previewBox = document.getElementById('previewBox');
      const statSize = document.getElementById('statSize');
      const statType = document.getElementById('statType');
      const statSpeed = document.getElementById('statSpeed');

      if (!loadedBase64) {
        alert('Please upload an image first!');
        return;
      }

      runBtn.disabled = true;
      runBtn.innerHTML = '<div class="spinner"></div>';

      const startTime = performance.now();

      let payload = { image: loadedBase64 };

      if (activeService === 'compress') {
        payload.format = document.getElementById('compressFormat').value;
        payload.quality = Number(document.getElementById('qualityRange').value);
      } else if (activeService === 'convert') {
        payload.outputFormat = document.getElementById('convertFormat').value;
      } else if (activeService === 'resize') {
        payload.width = Number(document.getElementById('resizeWidth').value);
        payload.height = Number(document.getElementById('resizeHeight').value);
        payload.fit = document.getElementById('resizeFit').value;
      }

      try {
        const res = await fetch(\`/v1/\${activeService}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        statSpeed.textContent = \`\${responseTime} ms\`;

        const contentType = res.headers.get('content-type') || '';
        statType.textContent = contentType.split(';')[0];

        if (res.ok) {
          const blob = await res.blob();
          const imageUrl = URL.createObjectURL(blob);
          previewBox.innerHTML = \`<img src="\${imageUrl}" alt="Delivered Image File">\`;
          statSize.textContent = formatBytes(blob.size);
          jsonOutput.textContent = \`✅ RAW IMAGE FILE DELIVERED DIRECTLY!\n\nHTTP Status: \${res.status} OK\nContent-Type: \${contentType}\nDelivered Size: \${formatBytes(blob.size)}\`;
        } else {
          const errorData = await res.json();
          jsonOutput.textContent = JSON.stringify(errorData, null, 2);
        }
      } catch (err) {
        jsonOutput.textContent = \`Network error: \${err.message}\`;
      } finally {
        runBtn.disabled = false;
        runBtn.textContent = 'Process & Deliver Image 🚀';
      }
    });

    function formatBytes(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  </script>
</body>
</html>`;

export const PLAYGROUND_TEST1_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PixelFlow AI — Live Demo & Image Optimization Showcase</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: rgba(20, 27, 44, 0.85);
      --card-border: rgba(255, 255, 255, 0.1);
      --accent: #3b82f6;
      --accent-gradient: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
      --accent-glow: rgba(59, 130, 246, 0.4);
      --green: #10b981;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --radius: 16px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Outfit', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.18) 0%, transparent 45%),
        radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 45%);
    }

    header {
      padding: 20px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--card-border);
      backdrop-filter: blur(12px);
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 44px;
      height: 44px;
      background: var(--accent-gradient);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-weight: 800;
      font-size: 22px;
      box-shadow: 0 0 24px var(--accent-glow);
    }

    .logo-text {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .badge {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .status-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--text-muted);
    }

    .dot {
      width: 10px;
      height: 10px;
      background: var(--green);
      border-radius: 50%;
      box-shadow: 0 0 12px var(--green);
    }

    main {
      flex: 1;
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 40px 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }

    @media (max-width: 968px) {
      main { grid-template-columns: 1fr; }
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--radius);
      padding: 28px;
      backdrop-filter: blur(16px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }

    .card-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .dropzone {
      border: 2px dashed rgba(255, 255, 255, 0.25);
      border-radius: 14px;
      padding: 36px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.03);
      margin-bottom: 24px;
    }

    .dropzone:hover, .dropzone.dragover {
      border-color: var(--accent);
      background: rgba(59, 130, 246, 0.1);
      transform: translateY(-2px);
    }

    .dropzone-icon {
      font-size: 46px;
      margin-bottom: 10px;
    }

    .dropzone-text {
      font-size: 15px;
      color: var(--text-muted);
    }

    .dropzone-text strong {
      color: var(--text);
    }

    .input-group {
      margin-bottom: 20px;
    }

    .label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    input[type="text"], input[type="number"], select {
      width: 100%;
      padding: 12px 16px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      color: var(--text);
      font-family: inherit;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    input[type="text"]:focus, select:focus {
      border-color: var(--accent);
    }

    .tabs {
      display: flex;
      gap: 8px;
      background: rgba(0,0,0,0.4);
      padding: 6px;
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .tab {
      flex: 1;
      padding: 12px;
      text-align: center;
      border: none;
      background: transparent;
      color: var(--text-muted);
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab.active {
      background: var(--accent-gradient);
      color: white;
      box-shadow: 0 4px 14px var(--accent-glow);
    }

    .service-panel { display: none; }
    .service-panel.active { display: block; }

    .slider-container {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    input[type="range"] {
      flex: 1;
      accent-color: var(--accent);
    }

    .btn {
      width: 100%;
      padding: 16px;
      background: var(--accent-gradient);
      border: none;
      border-radius: 12px;
      color: white;
      font-family: inherit;
      font-weight: 800;
      font-size: 16px;
      cursor: pointer;
      box-shadow: 0 4px 20px var(--accent-glow);
      transition: transform 0.1s, opacity 0.2s;
      margin-top: 10px;
    }

    .btn:hover { opacity: 0.95; }
    .btn:active { transform: scale(0.99); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .preview-box {
      width: 100%;
      height: 320px;
      background: rgba(0,0,0,0.5);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      display: grid;
      place-items: center;
      overflow: hidden;
      position: relative;
      margin-bottom: 24px;
    }

    .preview-box img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .placeholder-text {
      color: var(--text-muted);
      font-size: 14px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: rgba(0,0,0,0.3);
      border: 1px solid var(--card-border);
      padding: 14px;
      border-radius: 10px;
      text-align: center;
    }

    .stat-val {
      font-size: 16px;
      font-weight: 700;
      color: var(--green);
    }

    .stat-label {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .json-output {
      background: rgba(0,0,0,0.6);
      border: 1px solid var(--card-border);
      padding: 16px;
      border-radius: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #6ee7b7;
      max-height: 180px;
      overflow-y: auto;
      white-space: pre-wrap;
    }

    .download-btn {
      display: none;
      width: 100%;
      padding: 12px;
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
      font-family: inherit;
      font-weight: 700;
      font-size: 14px;
      border-radius: 10px;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      margin-top: 12px;
    }

    .download-btn:hover {
      background: rgba(16, 185, 129, 0.3);
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255,255,255,0.2);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>

  <header>
    <div class="logo-container">
      <div class="logo-icon">PF</div>
      <div>
        <div class="logo-text">PixelFlow AI</div>
      </div>
      <span class="badge">Live Demo Playground 🎬</span>
    </div>
    <div class="status-pill">
      <span class="dot"></span> Direct High-Speed Engine
    </div>
  </header>

  <main>
    <div class="card">
      <div class="card-title">📁 Upload Source Image</div>

      <div class="dropzone" id="dropzone">
        <div class="dropzone-icon">📷</div>
        <div class="dropzone-text"><strong>Click to upload image</strong> or drag & drop photo</div>
        <input type="file" id="fileInput" accept="image/*" style="display:none">
      </div>

      <div class="card-title">⚙️ Select Image Transformation</div>

      <div class="tabs">
        <button class="tab active" data-service="compress">Ultra Compress</button>
        <button class="tab" data-service="convert">Format Convert</button>
        <button class="tab" data-service="resize">Smart Resize</button>
      </div>

      <div id="panel-compress" class="service-panel active">
        <div class="input-group">
          <label class="label">Target Format</label>
          <select id="compressFormat">
            <option value="webp" selected>WebP (Maximum Savings)</option>
            <option value="avif">AVIF (Ultra High Quality)</option>
            <option value="jpg">JPEG Optimized</option>
            <option value="png">PNG Palette</option>
          </select>
        </div>
        <div class="input-group">
          <label class="label">Quality: <span id="qualityVal">75</span>%</label>
          <div class="slider-container">
            <input type="range" id="qualityRange" min="10" max="100" value="75">
          </div>
        </div>
      </div>

      <div id="panel-convert" class="service-panel">
        <div class="input-group">
          <label class="label">Convert To Format</label>
          <select id="convertFormat">
            <option value="png">PNG (Lossless)</option>
            <option value="jpg">JPG (Standard Photo)</option>
            <option value="webp" selected>WebP (Web Modern)</option>
            <option value="avif">AVIF (Next-Gen)</option>
          </select>
        </div>
      </div>

      <div id="panel-resize" class="service-panel">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="input-group">
            <label class="label">Target Width (px)</label>
            <input type="number" id="resizeWidth" value="600" placeholder="e.g. 600">
          </div>
          <div class="input-group">
            <label class="label">Target Height (px)</label>
            <input type="number" id="resizeHeight" value="600" placeholder="e.g. 600">
          </div>
        </div>
        <div class="input-group">
          <label class="label">Fit Mode</label>
          <select id="resizeFit">
            <option value="cover" selected>Cover (Auto-Crop)</option>
            <option value="contain">Contain (Keep Ratio)</option>
            <option value="fill">Fill (Exact Stretch)</option>
          </select>
        </div>
      </div>

      <button class="btn" id="runBtn">Run Optimization & Deliver ⚡</button>
    </div>

    <div class="card">
      <div class="card-title">🖼️ Delivered Image Result</div>

      <div class="preview-box" id="previewBox">
        <span class="placeholder-text">Upload any image and click Run Optimization</span>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-val" id="statSize">-</div>
          <div class="stat-label">Delivered Size</div>
        </div>
        <div class="stat-card">
          <div class="stat-val" id="statType">-</div>
          <div class="stat-label">Delivered Format</div>
        </div>
        <div class="stat-card">
          <div class="stat-val" id="statSpeed">-</div>
          <div class="stat-label">Execution Time</div>
        </div>
      </div>

      <div class="card-title" style="font-size: 14px; margin-bottom: 10px;">📊 Execution Log</div>
      <div class="json-output" id="jsonOutput">Ready for live demo test.</div>

      <a id="downloadBtn" class="download-btn" download="pixel_flow_delivered.webp">⬇️ Download Delivered Image File</a>
    </div>
  </main>

  <script>
    let activeService = 'compress';
    let loadedBase64 = null;
    let originalSizeBytes = 0;

    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) handleFile(e.target.files[0]);
    });

    function handleFile(file) {
      originalSizeBytes = file.size;
      const reader = new FileReader();
      reader.onload = (e) => {
        loadedBase64 = e.target.result;
        dropzone.querySelector('.dropzone-text').innerHTML = \`<strong>Loaded:</strong> \${file.name} (\${formatBytes(file.size)})\`;
      };
      reader.readAsDataURL(file);
    }

    const qualityRange = document.getElementById('qualityRange');
    const qualityVal = document.getElementById('qualityVal');
    qualityRange.addEventListener('input', (e) => qualityVal.textContent = e.target.value);

    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.service-panel').forEach(p => p.classList.remove('active'));
        
        tab.classList.add('active');
        activeService = tab.dataset.service;
        document.getElementById(\`panel-\${activeService}\`).classList.add('active');
      });
    });

    document.getElementById('runBtn').addEventListener('click', async () => {
      const runBtn = document.getElementById('runBtn');
      const jsonOutput = document.getElementById('jsonOutput');
      const previewBox = document.getElementById('previewBox');
      const statSize = document.getElementById('statSize');
      const statType = document.getElementById('statType');
      const statSpeed = document.getElementById('statSpeed');
      const downloadBtn = document.getElementById('downloadBtn');

      if (!loadedBase64) {
        alert('Please upload an image first!');
        return;
      }

      runBtn.disabled = true;
      runBtn.innerHTML = '<div class="spinner"></div> Processing...';

      const startTime = performance.now();

      let payload = { image: loadedBase64 };

      if (activeService === 'compress') {
        payload.format = document.getElementById('compressFormat').value;
        payload.quality = Number(document.getElementById('qualityRange').value);
      } else if (activeService === 'convert') {
        payload.outputFormat = document.getElementById('convertFormat').value;
      } else if (activeService === 'resize') {
        payload.width = Number(document.getElementById('resizeWidth').value);
        payload.height = Number(document.getElementById('resizeHeight').value);
        payload.fit = document.getElementById('resizeFit').value;
      }

      try {
        const res = await fetch(\`/v1/test1/\${activeService}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        statSpeed.textContent = \`\${responseTime} ms\`;

        const contentType = res.headers.get('content-type') || '';
        statType.textContent = contentType.split(';')[0];

        if (res.ok) {
          const blob = await res.blob();
          const imageUrl = URL.createObjectURL(blob);
          previewBox.innerHTML = \`<img src="\${imageUrl}" alt="Delivered Image File">\`;
          statSize.textContent = formatBytes(blob.size);
          
          let savingsText = '';
          if (originalSizeBytes > 0) {
            const savingsPercent = ((1 - blob.size / originalSizeBytes) * 100).toFixed(1);
            savingsText = \`\nSavings: \${savingsPercent}%\`;
          }

          jsonOutput.textContent = \`🎉 DELIVERED REAL IMAGE BINARY DELIVERABLE!\n\nHTTP Status: \${res.status} OK\nContent-Type: \${contentType}\nOriginal Size: \${formatBytes(originalSizeBytes)}\nDelivered Size: \${formatBytes(blob.size)}\${savingsText}\`;

          downloadBtn.href = imageUrl;
          downloadBtn.download = \`pixelflow_\${activeService}_\${Date.now()}.\${contentType.split('/')[1] || 'png'}\`;
          downloadBtn.style.display = 'block';
        } else {
          const errorData = await res.json();
          jsonOutput.textContent = JSON.stringify(errorData, null, 2);
          downloadBtn.style.display = 'none';
        }
      } catch (err) {
        jsonOutput.textContent = \`Network error: \${err.message}\`;
        downloadBtn.style.display = 'none';
      } finally {
        runBtn.disabled = false;
        runBtn.textContent = 'Run Optimization & Deliver ⚡';
      }
    });

    function formatBytes(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  </script>
</body>
</html>`;
