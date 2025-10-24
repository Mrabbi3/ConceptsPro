import React from 'react';
import { Code } from 'lucide-react';

const EncodingVisual = ({ isAnimating, animationStep }) => {
  const data = "A";
  const binary = "01000001";
  
  return (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
        <h3 className="text-xl font-bold text-purple-900 mb-2 flex items-center gap-2">
          <Code className="w-6 h-6" />
          Encoder/Decoder
        </h3>
        <p className="text-purple-800 mb-4">
          <strong>Purpose:</strong> Converts data into a suitable format for transmission or storage
        </p>
      </div>

      <div className="flex items-center justify-around flex-wrap gap-8">
        <div className="flex flex-col items-center space-y-4 flex-1 min-w-[200px]">
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-600 mb-2">SOURCE</div>
            <div className={`bg-green-100 border-2 border-green-500 rounded-lg p-4 transition-all duration-500 ${animationStep >= 1 ? 'ring-4 ring-green-300' : ''}`}>
              <div className="text-4xl font-bold text-green-900">{data}</div>
              <div className="text-xs text-gray-600 mt-1">Character/Symbol</div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className={`transform transition-all duration-500 ${animationStep === 1 ? 'translate-y-2' : ''}`}>↓</div>
            <div className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold my-2">
              <Code className="w-5 h-5 inline mr-2" />
              ENCODER
            </div>
            <div className="text-xs bg-blue-100 px-2 py-1 rounded border border-blue-400">ASCII/UTF-8</div>
            <div className={`transform transition-all duration-500 ${animationStep === 1 ? 'translate-y-2' : ''}`}>↓</div>
          </div>

          <div className={`bg-blue-100 border-2 border-blue-500 rounded-lg p-4 transition-all duration-500 ${animationStep >= 2 ? 'ring-4 ring-blue-300' : ''}`}>
            <div className="font-mono text-lg font-bold text-blue-900">{binary}</div>
            <div className="text-xs text-gray-600 mt-1">Binary Data</div>
          </div>
        </div>

        <div className="flex flex-col items-center px-8">
          <div className={`text-4xl transition-all duration-1000 ${animationStep === 2 ? 'translate-x-8' : ''}`}>→</div>
          <div className="text-xs text-gray-600 mt-2">Transmission</div>
        </div>

        <div className="flex flex-col items-center space-y-4 flex-1 min-w-[200px]">
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-600 mb-2">DESTINATION</div>
            <div className={`bg-blue-100 border-2 border-blue-500 rounded-lg p-4 transition-all duration-500 ${animationStep >= 3 ? 'ring-4 ring-blue-300' : ''}`}>
              <div className="font-mono text-lg font-bold text-blue-900">{binary}</div>
              <div className="text-xs text-gray-600 mt-1">Binary Data</div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className={`transform transition-all duration-500 ${animationStep === 3 ? 'translate-y-2' : ''}`}>↓</div>
            <div className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold my-2">
              <Code className="w-5 h-5 inline mr-2" />
              DECODER
            </div>
            <div className="text-xs bg-blue-100 px-2 py-1 rounded border border-blue-400">ASCII/UTF-8</div>
            <div className={`transform transition-all duration-500 ${animationStep === 3 ? 'translate-y-2' : ''}`}>↓</div>
          </div>

          <div className={`bg-green-100 border-2 border-green-500 rounded-lg p-4 transition-all duration-500 ${animationStep === 0 && isAnimating ? 'ring-4 ring-green-300' : ''}`}>
            <div className="text-4xl font-bold text-green-900">{data}</div>
            <div className="text-xs text-gray-600 mt-1">Character/Symbol</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
        <h4 className="font-bold text-gray-800 mb-2">How It Works:</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li><strong>Encoding:</strong> Converts characters/symbols into binary format using standards like ASCII, UTF-8, or Base64</li>
          <li><strong>Decoding:</strong> Converts binary data back into readable characters/symbols</li>
          <li><strong>Example:</strong> Letter 'A' has ASCII value 65 (decimal) = 01000001 (binary)</li>
          <li><strong>Real-world use:</strong> File storage, data transmission, QR codes, barcodes</li>
        </ul>
      </div>
    </div>
  );
};

export default EncodingVisual;
