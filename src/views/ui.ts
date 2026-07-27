export const PLAYGROUND_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PixelFlow AI — Interactive API Playground</title>
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
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
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

    /* Input Section */
    .dropzone {
      border: 2px dashed rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 30px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.02);
      margin-bottom: 20px;
    }

    .dropzone:hover, .dropzone.dragover {
      border-color: var(--accent);
      background: rgba(99, 102, 241, 0.05);
    }

    .dropzone-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .dropzone-text {
      font-size: 14px;
      color: var(--text-muted);
    }

    .dropzone-text strong {
      color: var(--text);
    }

    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      color: var(--text-muted);
      font-size: 12px;
      margin: 20px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .divider::before, .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--card-border);
    }
    .divider::before { margin-right: 12px; }
    .divider::after { margin-left: 12px; }

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

    /* Tabs */
    .tabs {
      display: flex;
      gap: 6px;
      background: rgba(0,0,0,0.3);
      padding: 4px;
      border-radius: 12px;
      margin-bottom: 24px;
      overflow-x: auto;
    }

    .tab {
      flex: 1;
      padding: 10px 12px;
      text-align: center;
      border: none;
      background: transparent;
      color: var(--text-muted);
      font-family: inherit;
      font-size: 13px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
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
      padding: 14px;
      background: var(--accent-gradient);
      border: none;
      border-radius: 10px;
      color: white;
      font-family: inherit;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      box-shadow: 0 4px 20px var(--accent-glow);
      transition: transform 0.1s, opacity 0.2s;
      margin-top: 10px;
    }

    .btn:hover { opacity: 0.95; }
    .btn:active { transform: scale(0.99); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Output Section */
    .preview-box {
      width: 100%;
      height: 280px;
      background: rgba(0,0,0,0.4);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      display: grid;
      place-items: center;
      overflow: hidden;
      position: relative;
      margin-bottom: 20px;
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
      margin-bottom: 20px;
    }

    .stat-card {
      background: rgba(0,0,0,0.25);
      border: 1px solid var(--card-border);
      padding: 12px;
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
      padding: 14px;
      border-radius: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #a7f3d0;
      max-height: 200px;
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
      <span class="badge">A2MCP API</span>
    </div>
    <div class="status-pill">
      <span class="dot"></span> Server Live (X Layer eip155:196)
    </div>
  </header>

  <main>
    <!-- Left Column: Input Controls -->
    <div class="card">
      <div class="card-title">📷 Select Input Image</div>

      <!-- Drag and drop zone -->
      <div class="dropzone" id="dropzone">
        <div class="dropzone-icon">📁</div>
        <div class="dropzone-text"><strong>Click to upload</strong> or drag & drop image</div>
        <input type="file" id="fileInput" accept="image/*" style="display:none">
      </div>

      <div class="divider">OR</div>

      <div class="input-group">
        <label class="label">Image URL</label>
        <input type="text" id="urlInput" value="https://picsum.photos/800/600" placeholder="https://example.com/photo.jpg">
      </div>

      <div class="card-title" style="margin-top: 30px;">⚙️ Choose Service</div>

      <!-- Service Tabs -->
      <div class="tabs">
        <button class="tab active" data-service="compress">Compress ($0.01)</button>
        <button class="tab" data-service="convert">Convert ($0.01)</button>
        <button class="tab" data-service="resize">Resize ($0.01)</button>
        <button class="tab" data-service="strip-exif">EXIF Strip ($0.005)</button>
        <button class="tab" data-service="inspect">Inspect (Free JSON)</button>
      </div>

      <!-- Service Option Panels -->
      <div id="panel-compress" class="service-panel active">
        <div class="input-group">
          <label class="label">Output Image Format</label>
          <select id="compressFormat">
            <option value="webp">WebP (Recommended)</option>
            <option value="avif">AVIF (Ultra High Compression)</option>
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
            <input type="number" id="resizeWidth" value="400" placeholder="e.g. 400">
          </div>
          <div class="input-group">
            <label class="label">Height (px)</label>
            <input type="number" id="resizeHeight" value="300" placeholder="e.g. 300">
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

      <div id="panel-strip-exif" class="service-panel">
        <p style="font-size: 13px; color: var(--text-muted);">Delivers actual cleaned image file with EXIF, GPS location, camera serial numbers, and timestamps removed.</p>
      </div>

      <div id="panel-inspect" class="service-panel">
        <p style="font-size: 13px; color: var(--text-muted);">Delivers JSON diagnostic analysis (dimensions, format, color space, estimated WebP/AVIF savings).</p>
      </div>

      <button class="btn" id="runBtn">Run Processing & Deliver Image 🚀</button>
    </div>

    <!-- Right Column: Results & Output -->
    <div class="card">
      <div class="card-title">✨ Delivered Output</div>

      <div class="preview-box" id="previewBox">
        <span class="placeholder-text">Delivered output image will appear here</span>
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

      <div class="card-title" style="font-size: 14px; margin-bottom: 10px;">📄 Delivery Details</div>
      <div class="json-output" id="jsonOutput">Ready to test. Click "Run Processing & Deliver Image" to test.</div>
    </div>
  </main>

  <script>
    let activeService = 'compress';
    let loadedBase64 = null;

    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const urlInput = document.getElementById('urlInput');

    dropzone.addEventListener('click', () => fileInput.click());
    
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

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
        urlInput.value = '';
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

      runBtn.disabled = true;
      runBtn.innerHTML = '<div class="spinner"></div>';

      const startTime = performance.now();

      let payload = {};
      if (loadedBase64 && !urlInput.value) {
        payload.image = loadedBase64;
      } else {
        payload.url = urlInput.value || 'https://picsum.photos/800/600';
      }

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

        if (activeService === 'inspect' || contentType.includes('application/json')) {
          const data = await res.json();
          jsonOutput.textContent = JSON.stringify(data, null, 2);
          if (data.sizeBytes) statSize.textContent = formatBytes(data.sizeBytes);
          if (data.image) {
            previewBox.innerHTML = \`<img src="\${data.image}" alt="Processed Image">\`;
          }
        } else {
          // Raw Image File delivered directly!
          const blob = await res.blob();
          const imageUrl = URL.createObjectURL(blob);
          previewBox.innerHTML = \`<img src="\${imageUrl}" alt="Delivered Image File">\`;
          statSize.textContent = formatBytes(blob.size);
          jsonOutput.textContent = \`✅ RAW IMAGE FILE DELIVERED DIRECTLY TO BUYER!\n\nHTTP Status: \${res.status} OK\nContent-Type: \${contentType}\nContent-Length: \${blob.size} bytes\nFilename: \${res.headers.get('content-disposition') || 'pixelflow-output'}\`;
        }
      } catch (err) {
        jsonOutput.textContent = \`Network error: \${err.message}\`;
      } finally {
        runBtn.disabled = false;
        runBtn.textContent = 'Run Processing & Deliver Image 🚀';
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
