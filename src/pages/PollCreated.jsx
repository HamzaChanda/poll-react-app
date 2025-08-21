import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import QRCodeDisplay from '../components/QRCodeDisplay';

function PollCreated() {
  const { id } = useParams();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/poll/${id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="card created-view">
      <h2>Poll Created!</h2>
      <p>Share this link with others to start collecting votes.</p>
      
      <div className="share-box">
        <input type="text" value={shareUrl} readOnly />
        <button onClick={copyToClipboard} className="primary-btn">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="qr-code-container">
         <QRCodeDisplay url={shareUrl} />
         <p>Or scan the QR code</p>
      </div>
    </div>
  );
}

export default PollCreated;