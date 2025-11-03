import React from 'react';
import { GitBranch } from 'lucide-react';

const MultiplexingVisual = ({ isAnimating, animationStep }) => {
  return (
    <div className="space-y-6">
      <div className="bg-teal-50 p-4 rounded-lg border-2 border-teal-200">
        <h3 className="text-xl font-bold text-teal-900 mb-2 flex items-center gap-2">
          <GitBranch className="w-6 h-6" />
          Multiplexor/Demultiplexor (MUX/DEMUX)
        </h3>
        <p className="text-teal-800 mb-4">
          <strong>Purpose:</strong> Combines multiple signals into one for efficient transmission, then separates them back
        </p>
      </div>

      <div className="flex items-center justify-around flex-wrap gap-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-sm font-semibold text-gray-600 mb-2">MULTIPLE SOURCES</div>
          
          <div className="space-y-3">
            <div className={`flex items-center gap-3 transition-all duration-500 ${animationStep >= 1 ? 'translate-x-2' : ''}`}>
              <div className="bg-red-100 border-2 border-red-500 rounded px-4 py-2 w-32 text-center">
                <div className="font-bold text-red-900">Signal A</div>
                <div className="text-xs">Voice Call</div>
              </div>
              <div className="text-2xl">→</div>
            </div>
            
            <div className={`flex items-center gap-3 transition-all duration-500 ${animationStep >= 1 ? 'translate-x-2' : ''}`}>
              <div className="bg-blue-100 border-2 border-blue-500 rounded px-4 py-2 w-32 text-center">
                <div className="font-bold text-blue-900">Signal B</div>
                <div className="text-xs">Video Stream</div>
              </div>
              <div className="text-2xl">→</div>
            </div>
            
            <div className={`flex items-center gap-3 transition-all duration-500 ${animationStep >= 1 ? 'translate-x-2' : ''}`}>
              <div className="bg-green-100 border-2 border-green-500 rounded px-4 py-2 w-32 text-center">
                <div className="font-bold text-green-900">Signal C</div>
                <div className="text-xs">Data Transfer</div>
              </div>
              <div className="text-2xl">→</div>
            </div>
            
            <div className={`flex items-center gap-3 transition-all duration-500 ${animationStep >= 1 ? 'translate-x-2' : ''}`}>
              <div className="bg-yellow-100 border-2 border-yellow-500 rounded px-4 py-2 w-32 text-center">
                <div className="font-bold text-yellow-900">Signal D</div>
                <div className="text-xs">Web Browsing</div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mx-4">
          <div className={`bg-teal-600 text-white px-6 py-8 rounded-lg font-bold text-center transition-all duration-500 ${animationStep === 1 ? 'scale-110 ring-4 ring-teal-300' : ''}`}>
            <GitBranch className="w-8 h-8 mx-auto mb-2" />
            <div>MUX</div>
            <div className="text-xs mt-2 font-normal">Combines</div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="font-bold text-purple-900 text-center mb-2">Combined Signal</div>
          <div className="flex gap-1 justify-center mb-2">
            <div className="w-4 h-16 bg-red-500"></div>
            <div className="w-4 h-16 bg-blue-500"></div>
            <div className="w-4 h-16 bg-green-500"></div>
            <div className="w-4 h-16 bg-yellow-500"></div>
            <div className="w-4 h-16 bg-red-500"></div>
            <div className="w-4 h-16 bg-blue-500"></div>
          </div>
          <div className="text-xs text-center">A|B|C|D|A|B...</div>
          
          <div className={`my-4 text-4xl transition-all duration-1000 ${animationStep === 2 ? 'translate-x-16' : ''}`}>→</div>
          
          <div className="text-xs text-gray-600">Single Channel</div>
        </div>

        <div className="flex flex-col items-center mx-4">
          <div className={`bg-teal-600 text-white px-6 py-8 rounded-lg font-bold text-center transition-all duration-500 ${animationStep === 3 ? 'scale-110 ring-4 ring-teal-300' : ''}`}>
            <GitBranch className="w-8 h-8 mx-auto mb-2 transform rotate-180" />
            <div>DEMUX</div>
            <div className="text-xs mt-2 font-normal">Separates</div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="text-sm font-semibold text-gray-600 mb-2">DESTINATIONS</div>
          
          <div className="space-y-3">
            <div className={`flex items-center gap-3 transition-all duration-500 ${animationStep === 0 && isAnimating ? '-translate-x-2' : ''}`}>
              <div className="text-2xl">→</div>
              <div className="bg-red-100 border-2 border-red-500 rounded px-4 py-2 w-32 text-center">
                <div className="font-bold text-red-900">Signal A</div>
                <div className="text-xs">Voice Call</div>
              </div>
            </div>
            
            <div className={`flex items-center gap-3 transition-all duration-500 ${animationStep === 0 && isAnimating ? '-translate-x-2' : ''}`}>
              <div className="text-2xl">→</div>
              <div className="bg-blue-100 border-2 border-blue-500 rounded px-4 py-2 w-32 text-center">
                <div className="font-bold text-blue-900">Signal B</div>
                <div className="text-xs">Video Stream</div>
              </div>
            </div>
            
            <div className={`flex items-center gap-3 transition-all duration-500 ${animationStep === 0 && isAnimating ? '-translate-x-2' : ''}`}>
              <div className="text-2xl">→</div>
              <div className="bg-green-100 border-2 border-green-500 rounded px-4 py-2 w-32 text-center">
                <div className="font-bold text-green-900">Signal C</div>
                <div className="text-xs">Data Transfer</div>
              </div>
            </div>
            
            <div className={`flex items-center gap-3 transition-all duration-500 ${animationStep === 0 && isAnimating ? '-translate-x-2' : ''}`}>
              <div className="text-2xl">→</div>
              <div className="bg-yellow-100 border-2 border-yellow-500 rounded px-4 py-2 w-32 text-center">
                <div className="font-bold text-yellow-900">Signal D</div>
                <div className="text-xs">Web Browsing</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
        <h4 className="font-bold text-gray-800 mb-2">How It Works:</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li><strong>Multiplexor (MUX):</strong> Combines multiple input signals into one output signal for efficient transmission</li>
          <li><strong>Demultiplexor (DEMUX):</strong> Separates the combined signal back into individual original signals</li>
          <li><strong>TDM (Time Division):</strong> Each signal gets a time slot (used in digital phone systems)</li>
          <li><strong>FDM (Frequency Division):</strong> Each signal gets a frequency band (used in radio/TV broadcasting)</li>
          <li><strong>WDM (Wavelength Division):</strong> Uses different light wavelengths (used in fiber optics)</li>
          <li><strong>Benefit:</strong> Maximizes channel utilization, reduces costs by sharing expensive transmission media</li>
        </ul>
      </div>
    </div>
  );
};

export default MultiplexingVisual;
