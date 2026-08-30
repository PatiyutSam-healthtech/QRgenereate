(function () {
  const textInput = document.getElementById("text-input");
  const sizeInput = document.getElementById("size-input");
  const eccInput = document.getElementById("ecc-input");
  const fgColorInput = document.getElementById("fg-color");
  const bgColorInput = document.getElementById("bg-color");
  const generateBtn = document.getElementById("generate-btn");
  const downloadBtn = document.getElementById("download-btn");
  const errorMsg = document.getElementById("error-msg");
  const wrapper = document.getElementById("qr-canvas-wrapper");

  let qrInstance = null;

  function showError(message) {
    errorMsg.textContent = message;
    errorMsg.hidden = !message;
  }

  function correctLevel(value) {
    return QRCode.CorrectLevel[value] ?? QRCode.CorrectLevel.M;
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

    downloadBtn.disabled = false;
  }

  function downloadQRCode() {
    const canvas = wrapper.querySelector("canvas");
    const img = wrapper.querySelector("img");
    const dataUrl = canvas ? canvas.toDataURL("image/png") : img?.src;

    if (!dataUrl) {
      showError("ยังไม่มี QR Code ให้ดาวน์โหลด กรุณาสร้างก่อน");
      return;
    }

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  generateBtn.addEventListener("click", generateQRCode);
  downloadBtn.addEventListener("click", downloadQRCode);
  textInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      generateQRCode();
    }
  });
})();
