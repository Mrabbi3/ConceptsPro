import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Radio, Lock, Code, Waves, GitBranch } from 'lucide-react';

const DataCommunicationFrameworks = () => {
  const [activeTab, setActiveTab] = useState('encryption');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    let interval;
    if (isAnimating) {
      interval = setInterval(() => {
        setAnimationStep(prev => (prev + 1) % 4);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isAnimating]);

  const resetAnimation = () => {
    setAnimationStep(0);
    setIsAnimating(false);
  };

  // Encryption/Decryption Component
  const EncryptionVisual = () => {
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

        <div className="flex items-center justify-around">
          {/* Sender Side - Encryption */}
          <div className="flex flex-col items-center space-y-4 flex-1">
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-600 mb-2">SENDER</div>
              <div className={`bg-green-100 border-2 border-green-500 rounded-lg p-4 transition-all duration-500 ${animationStep >= 1 ? 'ring-4 ring-green-300' : ''}`}>
                <div className="font-mono text-2xl font-bold text-green-900">{plaintext}</div>
                <div className="text-xs text-gray-600 mt-1">Plain Text</div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className={`transform transition-all duration-500 ${animationStep === 1 ? 'translate-y-2' : ''}`}>
                ↓
              </div>
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold my-2">
                <Lock className="w-5 h-5 inline mr-2" />
                ENCRYPTOR
              </div>
              <div className="text-xs bg-yellow-100 px-2 py-1 rounded border border-yellow-400">
                {key}
              </div>
              <div className={`transform transition-all duration-500 ${animationStep === 1 ? 'translate-y-2' : ''}`}>
                ↓
              </div>
            </div>

            <div className={`bg-red-100 border-2 border-red-500 rounded-lg p-4 transition-all duration-500 ${animationStep >= 2 ? 'ring-4 ring-red-300' : ''}`}>
              <div className="font-mono text-2xl font-bold text-red-900">{ciphertext}</div>
              <div className="text-xs text-gray-600 mt-1">Cipher Text</div>
            </div>
          </div>

          {/* Channel */}
          <div className="flex flex-col items-center px-8">
            <div className={`text-4xl transition-all duration-1000 ${animationStep === 2 ? 'translate-x-8' : ''}`}>
              →
            </div>
            <div className="text-xs text-gray-600 mt-2">Insecure Channel</div>
          </div>

          {/* Receiver Side - Decryption */}
          <div className="flex flex-col items-center space-y-4 flex-1">
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-600 mb-2">RECEIVER</div>
              <div className={`bg-red-100 border-2 border-red-500 rounded-lg p-4 transition-all duration-500 ${animationStep >= 3 ? 'ring-4 ring-red-300' : ''}`}>
                <div className="font-mono text-2xl font-bold text-red-900">{ciphertext}</div>
                <div className="text-xs text-gray-600 mt-1">Cipher Text</div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className={`transform transition-all duration-500 ${animationStep === 3 ? 'translate-y-2' : ''}`}>
                ↓
              </div>
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold my-2">
                <Lock className="w-5 h-5 inline mr-2" />
                DECRYPTOR
              </div>
              <div className="text-xs bg-yellow-100 px-2 py-1 rounded border border-yellow-400">
                {key}
              </div>
              <div className={`transform transition-all duration-500 ${animationStep === 3 ? 'translate-y-2' : ''}`}>
                ↓
              </div>
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

  // Encoding/Decoding Component
  const EncodingVisual = () => {
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

        <div className="flex items-center justify-around">
          {/* Encoding */}
          <div className="flex flex-col items-center space-y-4 flex-1">
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-600 mb-2">SOURCE</div>
              <div className={`bg-green-100 border-2 border-green-500 rounded-lg p-4 transition-all duration-500 ${animationStep >= 1 ? 'ring-4 ring-green-300' : ''}`}>
                <div className="text-4xl font-bold text-green-900">{data}</div>
                <div className="text-xs text-gray-600 mt-1">Character/Symbol</div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className={`transform transition-all duration-500 ${animationStep === 1 ? 'translate-y-2' : ''}`}>
                ↓
              </div>
              <div className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold my-2">
                <Code className="w-5 h-5 inline mr-2" />
                ENCODER
              </div>
              <div className="text-xs bg-blue-100 px-2 py-1 rounded border border-blue-400">
                ASCII/UTF-8
              </div>
              <div className={`transform transition-all duration-500 ${animationStep === 1 ? 'translate-y-2' : ''}`}>
                ↓
              </div>
            </div>

            <div className={`bg-blue-100 border-2 border-blue-500 rounded-lg p-4 transition-all duration-500 ${animationStep >= 2 ? 'ring-4 ring-blue-300' : ''}`}>
              <div className="font-mono text-xl font-bold text-blue-900">{binary}</div>
              <div className="text-xs text-gray-600 mt-1">Digital Signal/Bits</div>
            </div>
          </div>

          {/* Channel */}
          <div className="flex flex-col items-center px-8">
            <div className={`text-4xl transition-all duration-1000 ${animationStep === 2 ? 'translate-x-8' : ''}`}>
              →
            </div>
            <div className="text-xs text-gray-600 mt-2">Transmission</div>
          </div>

          {/* Decoding */}
          <div className="flex flex-col items-center space-y-4 flex-1">
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-600 mb-2">DESTINATION</div>
              <div className={`bg-blue-100 border-2 border-blue-500 rounded-lg p-4 transition-all duration-500 ${animationStep >= 3 ? 'ring-4 ring-blue-300' : ''}`}>
                <div className="font-mono text-xl font-bold text-blue-900">{binary}</div>
                <div className="text-xs text-gray-600 mt-1">Digital Signal/Bits</div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className={`transform transition-all duration-500 ${animationStep === 3 ? 'translate-y-2' : ''}`}>
                ↓
              </div>
              <div className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold my-2">
                <Code className="w-5 h-5 inline mr-2" />
                DECODER
              </div>
              <div className="text-xs bg-blue-100 px-2 py-1 rounded border border-blue-400">
                ASCII/UTF-8
              </div>
              <div className={`transform transition-all duration-500 ${animationStep === 3 ? 'translate-y-2' : ''}`}>
                ↓
              </div>
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
            <li><strong>Encoder:</strong> Converts data from one format to another (character → binary, analog → digital)</li>
            <li><strong>Decoder:</strong> Reverses the encoding process to retrieve original data</li>
            <li><strong>Common schemes:</strong> ASCII (7-bit), UTF-8 (variable length), Manchester encoding, NRZ</li>
            <li><strong>Example:</strong> Letter 'A' (decimal 65) → binary 01000001 in ASCII</li>
            <li><strong>Key difference from encryption:</strong> Encoding is for format conversion, NOT security</li>
          </ul>
        </div>
      </div>
    );
  };

  // Modulation/Demodulation Component
  const ModulationVisual = () => {
    return (
      <div className="space-y-6">
        <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
          <h3 className="text-xl font-bold text-orange-900 mb-2 flex items-center gap-2">
            <Waves className="w-6 h-6" />
            Modulator/Demodulator (MODEM)
          </h3>
          <p className="text-orange-800 mb-4">
            <strong>Purpose:</strong> Converts digital signals to analog waves for transmission over physical media (and vice versa)
          </p>
        </div>

        <div className="flex items-center justify-around">
          {/* Modulation */}
          <div className="flex flex-col items-center space-y-4 flex-1">
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-600 mb-2">DIGITAL DEVICE</div>
              <div className={`bg-blue-100 border-2 border-blue-500 rounded-lg p-6 transition-all duration-500 ${animationStep >= 1 ? 'ring-4 ring-blue-300' : ''}`}>
                <div className="flex gap-2 justify-center">
                  <div className="w-3 h-12 bg-blue-900"></div>
                  <div className="w-3 h-12 bg-white border border-blue-900"></div>
                  <div className="w-3 h-12 bg-blue-900"></div>
                  <div className="w-3 h-12 bg-blue-900"></div>
                  <div className="w-3 h-12 bg-white border border-blue-900"></div>
                </div>
                <div className="text-xs text-gray-600 mt-2">Digital Signal (1 0 1 1 0)</div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className={`transform transition-all duration-500 ${animationStep === 1 ? 'translate-y-2' : ''}`}>
                ↓
              </div>
              <div className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold my-2">
                <Radio className="w-5 h-5 inline mr-2" />
                MODULATOR
              </div>
              <div className="text-xs bg-pink-100 px-2 py-1 rounded border border-pink-400">
                AM/FM/PM
              </div>
              <div className={`transform transition-all duration-500 ${animationStep === 1 ? 'translate-y-2' : ''}`}>
                ↓
              </div>
            </div>

            <div className={`bg-green-100 border-2 border-green-500 rounded-lg p-6 transition-all duration-500 ${animationStep >= 2 ? 'ring-4 ring-green-300' : ''}`}>
              <svg width="200" height="60" className="mx-auto">
                <path d="M 0,30 Q 25,10 50,30 T 100,30 Q 125,50 150,30 T 200,30" 
                      stroke="#166534" strokeWidth="3" fill="none"/>
              </svg>
              <div className="text-xs text-gray-600 mt-2">Analog Wave (Carrier Signal)</div>
            </div>
          </div>

          {/* Channel */}
          <div className="flex flex-col items-center px-8">
            <div className={`text-4xl transition-all duration-1000 ${animationStep === 2 ? 'translate-x-8' : ''}`}>
              →
            </div>
            <div className="text-xs text-gray-600 mt-2">Phone Line/Cable/Air</div>
          </div>

          {/* Demodulation */}
          <div className="flex flex-col items-center space-y-4 flex-1">
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-600 mb-2">ANALOG MEDIUM</div>
              <div className={`bg-green-100 border-2 border-green-500 rounded-lg p-6 transition-all duration-500 ${animationStep >= 3 ? 'ring-4 ring-green-300' : ''}`}>
                <svg width="200" height="60" className="mx-auto">
                  <path d="M 0,30 Q 25,10 50,30 T 100,30 Q 125,50 150,30 T 200,30" 
                        stroke="#166534" strokeWidth="3" fill="none"/>
                </svg>
                <div className="text-xs text-gray-600 mt-2">Analog Wave (Carrier Signal)</div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className={`transform transition-all duration-500 ${animationStep === 3 ? 'translate-y-2' : ''}`}>
                ↓
              </div>
              <div className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold my-2">
                <Radio className="w-5 h-5 inline mr-2" />
                DEMODULATOR
              </div>
              <div className="text-xs bg-pink-100 px-2 py-1 rounded border border-pink-400">
                Extract Data
              </div>
              <div className={`transform transition-all duration-500 ${animationStep === 3 ? 'translate-y-2' : ''}`}>
                ↓
              </div>
            </div>

            <div className={`bg-blue-100 border-2 border-blue-500 rounded-lg p-6 transition-all duration-500 ${animationStep === 0 && isAnimating ? 'ring-4 ring-blue-300' : ''}`}>
              <div className="flex gap-2 justify-center">
                <div className="w-3 h-12 bg-blue-900"></div>
                <div className="w-3 h-12 bg-white border border-blue-900"></div>
                <div className="w-3 h-12 bg-blue-900"></div>
                <div className="w-3 h-12 bg-blue-900"></div>
                <div className="w-3 h-12 bg-white border border-blue-900"></div>
              </div>
              <div className="text-xs text-gray-600 mt-2">Digital Signal (1 0 1 1 0)</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
          <h4 className="font-bold text-gray-800 mb-2">How It Works:</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><strong>Modulator:</strong> Modifies properties of a carrier wave (amplitude, frequency, or phase) based on digital data</li>
            <li><strong>Demodulator:</strong> Extracts the original digital signal from the modulated analog wave</li>
            <li><strong>Types:</strong> ASK (Amplitude Shift Keying), FSK (Frequency Shift Keying), PSK (Phase Shift Keying)</li>
            <li><strong>Example:</strong> Your home modem converts computer's digital signals to analog for transmission over phone lines</li>
            <li><strong>Real-world use:</strong> DSL internet, cable modems, radio communications, WiFi</li>
          </ul>
        </div>
      </div>
    );
  };

  // Multiplexing/Demultiplexing Component
  const MultiplexingVisual = () => {
    return (
      <div className="space-y-6">
        <div className="bg-teal-50 p-4 rounded-lg border-2 border-teal-200">
          <h3 className="text-xl font-bold text-teal-900 mb-2 flex items-center gap-2">
            <GitBranch className="w-6 h-6" />
            Multiplexor/Demultiplexor (MUX/DEMUX)
          </h3>
          <p className="text-teal-800 mb-4">
            <strong>Purpose:</strong> Combines multiple signals into one channel (multiplexing) or separates them back (demultiplexing)
          </p>
        </div>

        <div className="flex items-center justify-around">
          {/* Multiplexing */}
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

          {/* MUX Box */}
          <div className="flex flex-col items-center mx-4">
            <div className={`bg-teal-600 text-white px-6 py-8 rounded-lg font-bold text-center transition-all duration-500 ${animationStep === 1 ? 'scale-110 ring-4 ring-teal-300' : ''}`}>
              <GitBranch className="w-8 h-8 mx-auto mb-2" />
              <div>MUX</div>
              <div className="text-xs mt-2 font-normal">Combines</div>
            </div>
            <div className="text-xs bg-purple-100 px-2 py-1 rounded border border-purple-400 mt-2">
              TDM/FDM/WDM
            </div>
          </div>

          {/* Combined Signal */}
          <div className="flex flex-col items-center">
            <div className={`bg-gradient-to-b from-red-200 via-blue-200 via-green-200 to-yellow-200 border-4 border-purple-500 rounded-lg p-6 transition-all duration-500 ${animationStep >= 2 ? 'ring-4 ring-purple-400' : ''}`}>
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
            </div>
            
            <div className={`my-4 text-4xl transition-all duration-1000 ${animationStep === 2 ? 'translate-x-16' : ''}`}>
              →
            </div>
            
            <div className="text-xs text-gray-600">Single Channel</div>
          </div>

          {/* DEMUX Box */}
          <div className="flex flex-col items-center mx-4">
            <div className={`bg-teal-600 text-white px-6 py-8 rounded-lg font-bold text-center transition-all duration-500 ${animationStep === 3 ? 'scale-110 ring-4 ring-teal-300' : ''}`}>
              <GitBranch className="w-8 h-8 mx-auto mb-2 transform rotate-180" />
              <div>DEMUX</div>
              <div className="text-xs mt-2 font-normal">Separates</div>
            </div>
          </div>

          {/* Demultiplexing */}
          <div className="flex flex-col items-center space-y-4">
            <div className="text-sm font-semibold text-gray-600 mb-2">INDIVIDUAL DESTINATIONS</div>
            
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

  const tabs = [
    { id: 'encryption', name: 'Encryption/Decryption', icon: Lock },
    { id: 'encoding', name: 'Encoding/Decoding', icon: Code },
    { id: 'modulation', name: 'Modulation/Demodulation', icon: Waves },
    { id: 'multiplexing', name: 'Multiplexing/Demultiplexing', icon: GitBranch }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Data Communication Frameworks
          </h1>
          <p className="text-gray-600 text-lg">
            Interactive Visual Guide for Computer Networking
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-2 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    resetAnimation();
                  }}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:inline">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Animation Controls */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md"
          >
            {isAnimating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isAnimating ? 'Pause' : 'Start'} Animation
          </button>
          <button
            onClick={resetAnimation}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-md"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {activeTab === 'encryption' && <EncryptionVisual />}
          {activeTab === 'encoding' && <EncodingVisual />}
          {activeTab === 'modulation' && <ModulationVisual />}
          {activeTab === 'multiplexing' && <MultiplexingVisual />}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>💡 Click "Start Animation" to see how data flows through each framework</p>
          <p className="mt-2">Good luck with your Computer Networking exam!</p>
        </div>
      </div>
    </div>
  );
};

export default DataCommunicationFrameworks;