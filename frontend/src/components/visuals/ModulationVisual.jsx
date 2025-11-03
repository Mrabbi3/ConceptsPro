import React from 'react';
import { Waves } from 'lucide-react';

const ModulationVisual = ({ isAnimating, animationStep }) => {
  return (
    <div className="space-y-6">
      <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
        <h3 className="text-xl font-bold text-orange-900 mb-2 flex items-center gap-2">
          <Waves className="w-6 h-6" />
          Modulator/Demodulator (MODEM)
        </h3>
        <p className="text-orange-800 mb-4">
          <strong>Purpose:</strong> Converts digital signals to analog for transmission over analog mediums and back
        </p>
      </div>

      <div className="flex items-center justify-around flex-wrap gap-8">
        <div className="flex flex-col items-center space-y-4 flex-1 min-w-[200px]">
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-600 mb-2">DIGITAL SOURCE</div>
            <div className={`bg-green-100 border-2 border-green-500 rounded-lg p-4 transition-all duration-500 ${animationStep >= 1 ? 'ring-4 ring-green-300' : ''}`}>
              <div className="font-mono text-xl font-bold text-green-900">101010</div>
              <div className="text-xs text-gray-600 mt-1">Digital Signal</div>
              <div className="mt-2 flex justify-center">
                <svg width="80" height="40" className="border border-gray-300 bg-white">
                  <polyline points="0,30 10,30 10,10 20,10 20,30 30,30 30,10 40,10 40,30 50,30 50,10 60,10 60,30 70,30" 
                            fill="none" stroke="green" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className={`transform transition-all duration-500 ${animationStep === 1 ? 'translate-y-2' : ''}`}>↓</div>
            <div className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold my-2">
              <Waves className="w-5 h-5 inline mr-2" />
              MODULATOR
            </div>
            <div className="text-xs bg-yellow-100 px-2 py-1 rounded border border-yellow-400">Carrier Signal</div>
            <div className={`transform transition-all duration-500 ${animationStep === 1 ? 'translate-y-2' : ''}`}>↓</div>
          </div>

          <div className={`bg-blue-100 border-2 border-blue-500 rounded-lg p-4 transition-all duration-500 ${animationStep >= 2 ? 'ring-4 ring-blue-300' : ''}`}>
            <div className="font-mono text-sm font-bold text-blue-900">Modulated</div>
            <div className="text-xs text-gray-600 mt-1">Analog Signal</div>
            <div className="mt-2 flex justify-center">
              <svg width="80" height="40" className="border border-gray-300 bg-white">
                <path d="M0,20 Q5,10 10,20 T20,20 Q25,30 30,20 T40,20 Q45,10 50,20 T60,20 Q65,30 70,20" 
                      fill="none" stroke="blue" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center px-8">
          <div className={`text-4xl transition-all duration-1000 ${animationStep === 2 ? 'translate-x-8' : ''}`}>→</div>
          <div className="text-xs text-gray-600 mt-2">Analog Medium</div>
          <div className="text-xs text-gray-500">(Phone line, Radio)</div>
        </div>

        <div className="flex flex-col items-center space-y-4 flex-1 min-w-[200px]">
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-600 mb-2">ANALOG RECEIVER</div>
            <div className={`bg-blue-100 border-2 border-blue-500 rounded-lg p-4 transition-all duration-500 ${animationStep >= 3 ? 'ring-4 ring-blue-300' : ''}`}>
              <div className="font-mono text-sm font-bold text-blue-900">Modulated</div>
              <div className="text-xs text-gray-600 mt-1">Analog Signal</div>
              <div className="mt-2 flex justify-center">
                <svg width="80" height="40" className="border border-gray-300 bg-white">
                  <path d="M0,20 Q5,10 10,20 T20,20 Q25,30 30,20 T40,20 Q45,10 50,20 T60,20 Q65,30 70,20" 
                        fill="none" stroke="blue" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className={`transform transition-all duration-500 ${animationStep === 3 ? 'translate-y-2' : ''}`}>↓</div>
            <div className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold my-2">
              <Waves className="w-5 h-5 inline mr-2" />
              DEMODULATOR
            </div>
            <div className="text-xs bg-yellow-100 px-2 py-1 rounded border border-yellow-400">Extract Data</div>
            <div className={`transform transition-all duration-500 ${animationStep === 3 ? 'translate-y-2' : ''}`}>↓</div>
          </div>

          <div className={`bg-green-100 border-2 border-green-500 rounded-lg p-4 transition-all duration-500 ${animationStep === 0 && isAnimating ? 'ring-4 ring-green-300' : ''}`}>
            <div className="font-mono text-xl font-bold text-green-900">101010</div>
            <div className="text-xs text-gray-600 mt-1">Digital Signal</div>
            <div className="mt-2 flex justify-center">
              <svg width="80" height="40" className="border border-gray-300 bg-white">
                <polyline points="0,30 10,30 10,10 20,10 20,30 30,30 30,10 40,10 40,30 50,30 50,10 60,10 60,30 70,30" 
                          fill="none" stroke="green" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
        <h4 className="font-bold text-gray-800 mb-2">How It Works:</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li><strong>Modulation:</strong> Varies carrier wave properties (amplitude, frequency, or phase) based on digital data</li>
          <li><strong>Demodulation:</strong> Extracts original digital information from the modulated analog signal</li>
          <li><strong>Types:</strong> AM (Amplitude Modulation), FM (Frequency Modulation), PM (Phase Modulation)</li>
          <li><strong>Real-world use:</strong> Dial-up internet, radio broadcasting, Wi-Fi, cellular networks</li>
        </ul>
      </div>
    </div>
  );
};

export default ModulationVisual;
