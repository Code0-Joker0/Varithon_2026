import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Share2, Copy, Check, Smartphone, Wifi, Globe, Edit3 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QRGeneratorModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [customSubtitle, setCustomSubtitle] = useState('पालखी तळ व दिंडी मदत केंद्रासाठी QR कोड');
  
  // Default to laptop's Wi-Fi network IP for mobile scanning
  const defaultMobileUrl = window.location.href.includes('localhost') || window.location.href.includes('127.0.0.1')
    ? window.location.href.replace(/localhost|127\.0\.0\.1/, '192.168.1.7')
    : window.location.href;

  const [qrTargetUrl, setQrTargetUrl] = useState(defaultMobileUrl);
  const qrRef = useRef(null);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrTargetUrl);
    setCopied(true);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    const svg = document.getElementById('varkari-portal-qr');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width + 80;
      canvas.height = img.height + 140;
      if (ctx) {
        // Draw Header background
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // White QR frame
        ctx.fillStyle = '#ffffff';
        ctx.roundRect(20, 20, canvas.width - 40, canvas.height - 40, 16);
        ctx.fill();
        
        // Header Text
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#800020';
        ctx.textAlign = 'center';
        ctx.fillText('॥ वारकरी सेवा पोर्टल ॥', canvas.width / 2, 52);

        // Draw QR
        ctx.drawImage(img, 40, 70);

        // Subtitle
        ctx.font = 'bold 13px Arial';
        ctx.fillStyle = '#1f2937';
        ctx.fillText('स्कॅन करा: हवामान, संपर्क व आरोग्य मार्गदर्शक', canvas.width / 2, canvas.height - 30);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `Varkari_Seva_Portal_QR.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-950 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-orange-500 relative overflow-hidden">
        {/* Background Saffron Flare */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-full transition border border-zinc-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center space-x-1.5 bg-orange-950 border border-orange-600 text-amber-300 px-3.5 py-1 rounded-full text-xs font-black mb-2">
            <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>मोबाईल वाय-फाय स्कॅन सज्ज</span>
          </div>
          <h3 className="text-2xl font-black text-white">
            मोबाईलवरून स्कॅन करण्यासाठी QR कोड
          </h3>
          <p className="text-xs text-zinc-300 font-bold mt-1">
            तुमच्या मोबाईलचा कॅमेरा उघडा व खालील QR कोड स्कॅन करा.
          </p>
        </div>

        {/* QR Card Frame */}
        <div ref={qrRef} className="bg-gradient-to-br from-orange-600 via-amber-600 to-red-700 p-4 rounded-2xl shadow-xl text-center text-white mb-4">
          <div className="bg-white p-5 rounded-xl shadow-inner inline-block">
            <QRCodeSVG
              id="varkari-portal-qr"
              value={qrTargetUrl}
              size={210}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ea580c'><path d='M12 2L2 22h20L12 2zm0 4.5l6.5 13H5.5L12 6.5z'/></svg>",
                x: undefined,
                y: undefined,
                height: 36,
                width: 36,
                excavate: true,
              }}
            />
          </div>
          
          <h4 className="font-black text-base mt-3 tracking-wide drop-shadow text-white">
            ॥ ज्ञानोबा माउली तुकाराम ॥
          </h4>
          <p className="text-xs font-bold opacity-90 mt-0.5">
            {customSubtitle}
          </p>
        </div>

        {/* Network IP Target URL Field */}
        <div className="space-y-2 mb-4 bg-zinc-900 p-3 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between text-xs font-black text-amber-400">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> मोबाईलवर उघडणारी लिंक (Network IP):
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
              वाय-फाय स्कॅन
            </span>
          </div>
          
          <input
            type="text"
            value={qrTargetUrl}
            onChange={(e) => setQrTargetUrl(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-zinc-700 bg-black text-amber-300 outline-none focus:border-orange-500"
            placeholder="http://192.168.1.7:5173/"
          />

          <div className="text-[11px] text-zinc-400 font-bold flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-orange-500" />
            <span>टीप: मोबाईल आणि लॅपटॉप एकाच Wi-Fi शी जोडलेले असावेत.</span>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadPNG}
            className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white py-3 px-3 rounded-xl font-black text-xs shadow-lg transition active:scale-95 border border-amber-300"
          >
            <Download className="w-4 h-4" />
            <span>चित्र (PNG) डाऊनलोड</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center space-x-2 bg-zinc-900 hover:bg-zinc-800 text-white py-3 px-3 rounded-xl font-black text-xs transition active:scale-95 border border-zinc-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'कॉपी झाले!' : 'लिंक कॉपी करा'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
