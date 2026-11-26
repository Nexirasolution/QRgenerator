import React, { useState } from 'react'
import "./App.css"

export const App = () => {
  const [img, setImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [qrdata, setQrdata] = useState("")
  const [qrsize, setQrsize] = useState("150")

  const generate = () => {
    if (!qrdata.trim()) return;                    // don't generate an empty QR code
    const size = Math.min(Math.max(parseInt(qrsize, 10) || 150, 50), 1000); // clamp 50-1000
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrdata)}`;
    setLoading(true);
    setImage(url);
  }

  const download = () => {
    if (!img) return;
    fetch(img)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "qrcode.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);              // free memory
      })
      .catch((error) => {
        console.error("Error in downloading QRcode : ", error);
      });
  }

  return (
    <div className='app-container'>
      <h1>QR code generator</h1>
      {loading && <p>Please Wait....</p>}
      {img && (
        <img
          src={img}
          alt={`QR code for ${qrdata}`}
          className='qrimg'
          style={{ display: loading ? 'none' : 'block' }}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      )}
      <div>
        <label htmlFor='dataInput' className='input-label'>Data for QR code</label>
        <input
          type='text'
          id='dataInput'
          value={qrdata}
          onChange={(e) => setQrdata(e.target.value)}
          placeholder='Enter data for QR code'
        />
        <label htmlFor='sizeInput' className='input-label'>Image size (e.g. 150)</label>
        <input
          type='number'
          id='sizeInput'
          value={qrsize}
          onChange={(e) => setQrsize(e.target.value)}
          placeholder='Enter image size'
        />
        <button className='btngenerate' disabled={loading} onClick={generate}>Generate QR code</button>
        <button className='btndwld' disabled={!img} onClick={download}>Download QR code</button>
      </div>
      <p>Designed by Asha mol D</p>
    </div>
  )
}