(function () {
  const textInput = document.getElementById("text-input");
  const labelInput = document.getElementById("label-input");
  const sizeInput = document.getElementById("size-input");
  const eccInput = document.getElementById("ecc-input");
  const fgColorInput = document.getElementById("fg-color");
  const bgColorInput = document.getElementById("bg-color");
  const generateBtn = document.getElementById("generate-btn");
  const downloadBtn = document.getElementById("download-btn");
  const errorMsg = document.getElementById("error-msg");
  const wrapper = document.getElementById("qr-canvas-wrapper");
  const qrLabel = document.getElementById("qr-label");

  const LABEL_MAX_LINES = 2;

  let qrInstance = null;

  function showError(message) {
    errorMsg.textContent = message;
    errorMsg.hidden = !message;
  }

  function correctLevel(value) {
    return QRCode.CorrectLevel[value] ?? QRCode.CorrectLevel.M;
  }

  // Character-based wrapping so labels with no spaces (Thai text) still
  // wrap correctly; caps at maxLines and ellipsizes any remaining overflow.
  function wrapLabelText(ctx, text, maxWidth, maxLines) {
    const chars = Array.from(text);
    const lines = [];
    let line = "";

    for (const ch of chars) {
      const testLine = line + ch;
      if (line && ctx.measureText(testLine).width > maxWidth) {
        lines.push(line);
        line = ch;
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);

    if (lines.length <= maxLines) {
      return lines;
    }

    const visibleLines = lines.slice(0, maxLines);
    let lastLine = visibleLines[maxLines - 1];
    while (lastLine.length > 0 && ctx.measureText(lastLine + "…").width > maxWidth) {
      lastLine = lastLine.slice(0, -1);
    }
    visibleLines[maxLines - 1] = lastLine + "…";
    return visibleLines;
  }

  function generateQRCode() {
    const text = textInput.value.trim();
    showError("");

    if (!text) {
      showError("กรุณาใส่ข้อความหรือลิงก์ก่อนสร้าง QR Code");
      downloadBtn.disabled = true;
      return;
    }

    const size = parseInt(sizeInput.value, 10);

    wrapper.innerHTML = "";
    qrInstance = new QRCode(wrapper, {
      text,
      width: size,
      height: size,
      colorDark: fgColorInput.value,
      colorLight: bgColorInput.value,
      correctLevel: correctLevel(eccInput.value),
    });

    const labelText = labelInput.value.trim();
    if (labelText) {
      qrLabel.textContent = labelText;
      qrLabel.style.width = size + "px";
      qrLabel.hidden = false;
    } else {
      qrLabel.textContent = "";
      qrLabel.hidden = true;
    }

    downloadBtn.disabled = false;
  }

  function downloadQRCode() {
    const canvas = wrapper.querySelector("canvas");
    const img = wrapper.querySelector("img");
    const source = canvas || img;

    if (!source) {
      showError("ยังไม่มี QR Code ให้ดาวน์โหลด กรุณาสร้างก่อน");
      return;
    }

    const labelText = labelInput.value.trim();
    const dataUrl = labelText
      ? buildLabeledDataUrl(source, labelText)
      : canvas
      ? canvas.toDataURL("image/png")
      : img.src;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function buildLabeledDataUrl(source, labelText) {
    const qrSize = source.width || source.naturalWidth;
    const padding = 16;
    const maxTextWidth = qrSize - padding * 2;
    const fontSize = Math.max(14, Math.round(qrSize * 0.065));
    const lineHeight = Math.round(fontSize * 1.4);
    const font = `600 ${fontSize}px "Kanit", "Segoe UI", sans-serif`;

    const measureCtx = document.createElement("canvas").getContext("2d");
    measureCtx.font = font;
    const lines = wrapLabelText(measureCtx, labelText, maxTextWidth, LABEL_MAX_LINES);

    const textBlockHeight = padding + lines.length * lineHeight + padding / 2;

    const outCanvas = document.createElement("canvas");
    outCanvas.width = qrSize;
    outCanvas.height = qrSize + textBlockHeight;

    const ctx = outCanvas.getContext("2d");
    ctx.fillStyle = bgColorInput.value || "#ffffff";
    ctx.fillRect(0, 0, outCanvas.width, outCanvas.height);
    ctx.drawImage(source, 0, 0, qrSize, qrSize);

    ctx.font = font;
    ctx.fillStyle = fgColorInput.value || "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    lines.forEach((line, i) => {
      ctx.fillText(line, qrSize / 2, qrSize + padding + i * lineHeight, maxTextWidth);
    });

    return outCanvas.toDataURL("image/png");
  }

  generateBtn.addEventListener("click", generateQRCode);
  downloadBtn.addEventListener("click", downloadQRCode);
  textInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      generateQRCode();
    }
  });
})();
