import { Html5QrcodeScanner } from "html5-qrcode";

let onSuccess
let html5QrcodeScanner

function onScanSuccess(decodedText, decodedResult) {
  // handle the scanned code as you like, for example:
  console.log(`Code matched = ${decodedText}`, decodedResult);
  onSuccess(decodedText);
}

function onScanFailure(error) {
  // handle scan failure, usually better to ignore and keep scanning.
  // for example:
  console.warn(`Code scan error = ${error}`);
}

export function createReader(successFunction){
  onSuccess = successFunction;
  html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 2, qrbox: { width: 250, height: 250 } },
    /* verbose= */ false);
  html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}
export function stopScanner(){
  html5QrcodeScanner.clear().then(() => console.log("Successfully Stopped")
  ).catch((error) => console.error(error)
  )
  
}

import QRCode from 'qrcode';
// var QRCode = require('qrcode')
export function generateQR(text){
  let canvas = document.getElementById('IDQR')
  
  QRCode.toCanvas(canvas, text, error => {
    if (error) console.error(error)
    console.log('qr generated!');
  })
}
/**
 * @param {string | QRCode.QRCodeSegment[]} text
 * @param {string} text id of canvas
 */
export function generateQRByID(text, id) {
  let canvas = document.getElementById(id)

  QRCode.toCanvas(canvas, text, error => {
    if (error) console.error(error)
    console.log('qr generated!');
  })
}