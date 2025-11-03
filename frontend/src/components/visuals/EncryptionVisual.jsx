import React from 'react';
import { Lock } from 'lucide-react';

const EncryptionVisual = ({ isAnimating, animationStep }) => {
  const plaintext = "HELLO";
  const key = "KEY: 3";
  const ciphertext = "KHOOR";
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
        <h3 className="text-xl font-bold text-blue-900 mb-2 flex items-center gap-2">
          <Lock className="w-6 h-6" />
          Encryptor/Decryptor
        </h3>
        <p className="text-blue-800 mb-4">
          <strong>Purpose:</strong> Secures data by converting readable information into scrambled format (encryption) and back (decryption)
        </p>
      </div>

      <div className="flex items-center justify-around flex-wrap gap-8">
        <div className="flex flex-col items-center space-y-4 flex-1 min-w-[200px]">
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-600 mb-2">SENDER</div>
            <div className={`bg-green-100 border-2 border-green-500 rounded-lg p-4 transition-all duration-500 ${animationStep >= 1 ? 'ring-4 ring-green-300' : ''}`}>
              <div className="font-mono text-2xl font-bold text-green-900">{plaintext}</div>
              <div className="text-xs text-gray-600 mt-1">Plain Text</div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className={`transform transition-all duration-500 ${animationStep === 1 ? 'translate-y-2' : ''}`}>↓</div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold my-2">
              <Lock className="w-5 h-5 inline mr-2" />
              ENCRYPTOR
            </div>
            <div className="text-xs bg-yellow-100 px-2 py-1 rounded border border-yellow-400">{key}</div>
            <div className={`transform transition-all duration-500 ${animationStep === 1 ? 'translate-y-2' : ''}`}>↓</div>
          </div>

          <div className={`bg-red-100 border-2 border-red-500 rounded-lg p-4 transition-all duration-500 ${animationStep >= 2 ? 'ring-4 ring-red-300' : ''}`}>
            <div className="font-mono text-2xl font-bold text-red-900">{ciphertext}</div>
            <div className="text-xs text-gray-600 mt-1">Cipher Text</div>
          </div>
        </div>

        <div className="flex flex-col items-center px-8">
          <div className={`text-4xl transition-all duration-1000 ${animationStep === 2 ? 'translate-x-8' : ''}`}>→</div>
          <div className="text-xs text-gray-600 mt-2">Insecure Channel</div>
        </div>

        <div className="flex flex-col items-center space-y-4 flex-1 min-w-[200px]">
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-600 mb-2">RECEIVER</div>
            <div className={`bg-red-100 border-2 border-red-500 rounded-lg p-4 transition-all duration-500 ${animationStep >= 3 ? 'ring-4 ring-red-300' : ''}`}>
              <div className="font-mono text-2xl font-bold text-red-900">{ciphertext}</div>
              <div className="text-xs text-gray-600 mt-1">Cipher Text</div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className={`transform transition-all duration-500 ${animationStep === 3 ? 'translate-y-2' : ''}`}>↓</div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold my-2">
              <Lock className="w-5 h-5 inline mr-2" />
              DECRYPTOR
            </div>
            <div className="text-xs bg-yellow-100 px-2 py-1 rounded border border-yellow-400">{key}</div>
            <div className={`transform transition-all duration-500 ${animationStep === 3 ? 'translate-y-2' : ''}`}>↓</div>
          </div>

          <div className={`bg-green-100 border-2 border-green-500 rounded-lg p-4 transition-all duration-500 ${animationStep === 0 && isAnimating ? 'ring-4 ring-green-300' : ''}`}>
            <div className="font-mono text-2xl font-bold text-green-900">{plaintext}</div>
            <div className="text-xs text-gray-600 mt-1">Plain Text</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
        <h4 className="font-bold text-gray-800 mb-2">How It Works:</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li><strong>Encryption:</strong> Uses a secret key and algorithm (like AES, RSA) to transform plaintext into unreadable ciphertext</li>
          <li><strong>Decryption:</strong> Uses the same (symmetric) or paired (asymmetric) key to convert ciphertext back to plaintext</li>
          <li><strong>Example:</strong> Caesar Cipher shifts each letter by 3 positions (H→K, E→H, L→O, L→O, O→R)</li>
          <li><strong>Real-world use:</strong> HTTPS, VPNs, encrypted messaging apps</li>
        </ul>
      </div>
    </div>
  );
};

export default EncryptionVisual;
