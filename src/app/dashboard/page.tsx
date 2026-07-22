"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { motion, AnimatePresence } from 'framer-motion';

// ---------------------------------------------------------
// EXTENSIVE FORMAT MAPPINGS
// ---------------------------------------------------------
const formatMap: Record<string, string[]> = {
  png: ["jpg", "webp", "gif", "pdf", "bmp", "tiff"],
  jpg: ["png", "webp", "gif", "pdf", "bmp", "tiff"],
  jpeg: ["png", "webp", "gif", "pdf", "bmp", "tiff"],
  webp: ["png", "jpg", "gif", "pdf", "bmp", "tiff"],
  gif: ["png", "jpg", "webp", "pdf", "bmp", "tiff"],
  bmp: ["png", "jpg", "webp", "gif", "pdf", "tiff"],
  tiff: ["png", "jpg", "webp", "gif", "pdf", "bmp"],
  md: ["pdf", "html", "docx"],
  txt: ["pdf", "docx"],
  docx: ["pdf", "txt"],
  csv: ["pdf", "json"],
  mp4: ["webm", "avi", "mov", "mkv", "gif", "mp3", "wav"],
  webm: ["mp4", "avi", "mov", "mkv", "gif", "mp3", "wav"],
  avi: ["mp4", "webm", "mov", "mkv", "gif", "mp3", "wav"],
  mov: ["mp4", "webm", "avi", "mkv", "gif", "mp3", "wav"],
  mkv: ["mp4", "webm", "avi", "mov", "gif", "mp3", "wav"],
  mp3: ["wav", "ogg", "aac", "flac", "m4a"],
  wav: ["mp3", "ogg", "aac", "flac", "m4a"],
  ogg: ["mp3", "wav", "aac", "flac", "m4a"],
  aac: ["mp3", "wav", "ogg", "flac", "m4a"],
  flac: ["mp3", "wav", "ogg", "aac", "m4a"],
  m4a: ["mp3", "wav", "ogg", "aac", "flac"],
};

const mediaExtensions = [
  'mp4', 'webm', 'avi', 'mov', 'mkv', 
  'mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'
];

type FileWithStatus = {
  file: globalThis.File;
  id: string;
  status: "pending" | "converting" | "success" | "error";
  targetFormat?: string;
  errorMsg?: string;
  downloadUrl?: string;
};

export default function Home() {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [targetFormat, setTargetFormat] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ffmpegRef = useRef<any>(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

  useEffect(() => {
    const loadFfmpeg = async () => {
      try {
        if (!ffmpegRef.current) {
          ffmpegRef.current = new FFmpeg();
        }
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on('log', ({ message }: { message: string }) => console.log('FFmpeg:', message));
        
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        setFfmpegLoaded(true);
      } catch (err) {
        console.error("Failed to load FFmpeg. Media conversions will be disabled.", err);
      }
    };
    loadFfmpeg();
  }, []);

  const getCommonExtension = () => {
    if (files.length === 0) return null;
    const exts = files.map(f => f.file.name.split('.').pop()?.toLowerCase());
    const firstExt = exts[0];
    const allSame = exts.every(ext => ext === firstExt);
    return allSame && firstExt ? firstExt : null;
  };

  const commonExt = getCommonExtension();
  const availableFormats = commonExt && formatMap[commonExt] ? formatMap[commonExt] : [];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const fileArray = Array.from(newFiles);
    const currentExt = commonExt;
    
    const validFiles = fileArray.filter(f => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      if (!ext || !formatMap[ext]) {
        alert(`Format ${ext} is not supported yet.`);
        return false;
      }
      if (files.length > 0 && currentExt && ext !== currentExt) {
        alert("Please select multiple files of the same type for batch conversion.");
        return false;
      }
      return true;
    });

    const newFilesWithStatus: FileWithStatus[] = validFiles.map(f => ({
      file: f,
      id: Math.random().toString(36).substring(7),
      status: "pending"
    }));

    setFiles(prev => [...prev, ...newFilesWithStatus]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, [files, commonExt]);

  const convertMediaWithFFmpeg = async (fileObj: FileWithStatus, targetExt: string) => {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpegLoaded) throw new Error("FFmpeg not loaded yet");

    const inputName = `input.${commonExt}`;
    const outputName = `output.${targetExt}`;

    await ffmpeg.writeFile(inputName, await fetchFile(fileObj.file));
    
    const isVideoOut = ['mp4', 'webm', 'avi', 'mov', 'mkv'].includes(targetExt);
    const args = ['-i', inputName];
    if (isVideoOut) {
      args.push('-preset', 'ultrafast');
    }
    args.push(outputName);

    await ffmpeg.exec(args);
    const data = await ffmpeg.readFile(outputName);
    const mimeType = isVideoOut ? `video/${targetExt}` : `audio/${targetExt}`;
    const blob = new Blob([data as any], { type: mimeType });
    return URL.createObjectURL(blob);
  };

  const convertWithApi = async (fileObj: FileWithStatus, targetExt: string) => {
    const formData = new FormData();
    formData.append('file', fileObj.file);
    formData.append('targetFormat', targetExt);

    const res = await fetch('/api/convert', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Conversion API failed');
    
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };

  const handleConvert = async () => {
    if (!targetFormat || files.length === 0) return;

    const isMedia = commonExt && mediaExtensions.includes(commonExt);
    
    setFiles(prev => prev.map(f => f.status === "pending" || f.status === "error" ? { ...f, status: "converting", targetFormat } : f));

    for (const f of files) {
      if (f.status === "success") continue;
      
      try {
        let url = "";
        if (isMedia) {
          url = await convertMediaWithFFmpeg(f, targetFormat);
        } else {
          url = await convertWithApi(f, targetFormat);
        }

        setFiles(prev => prev.map(file => {
          if (file.id === f.id) {
            return { ...file, status: "success", downloadUrl: url };
          }
          return file;
        }));
      } catch (err) {
        console.error(err);
        setFiles(prev => prev.map(file => {
          if (file.id === f.id) {
            return { ...file, status: "error", errorMsg: "Failed" };
          }
          return file;
        }));
      }
    }
  };

  const getMaterialIcon = (ext: string | null) => {
    if (!ext) return "description";
    if (mediaExtensions.includes(ext) && ext.match(/mp4|webm|avi|mov|mkv/)) return "videocam";
    if (mediaExtensions.includes(ext)) return "audiotrack";
    if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff'].includes(ext)) return "image";
    return "description";
  };

  return (
    <>
      {/* Top Navigation Shell */}
      <header className="fixed top-0 w-full bg-surface-container-low/80 backdrop-blur-[20px] flex justify-between items-center px-4 md:px-12 h-16 z-50 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-fixed-dim" style={{fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"}}>swap_horiz</span>
          <h1 className="text-xl md:text-2xl font-bold tracking-tighter text-primary-fixed-dim uppercase font-sans">CONVERTA</h1>
        </div>
        <div className="hidden md:flex gap-6 items-center">
          <nav className="flex gap-4">
            <a className="text-[12px] font-bold tracking-widest text-primary-fixed-dim hover:bg-white/5 transition-colors px-2 py-1 rounded" href="#">DASHBOARD</a>
          </nav>
        </div>
      </header>

      <main className="pt-24 pb-32 px-4 md:px-12 max-w-[1440px] mx-auto min-h-screen">
        
        {/* Welcome Hero Section */}
        <section className="mb-10 relative">
          <div className="absolute -top-12 -left-24 w-96 h-96 bg-primary-fixed-dim/5 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="relative z-10">
            <p className="text-[12px] font-bold text-primary-fixed-dim mb-1 tracking-widest animate-pulse-slow">SYSTEMS ACTIVE • v2.4.0</p>
            <h2 className="text-[32px] md:text-[48px] font-bold tracking-tight text-primary mb-2">Good morning, Agent</h2>
            <p className="text-[18px] text-on-surface-variant max-w-2xl">
              Ready to process your assets? Converta leverages high-performance WASM and Serverless APIs for maximum precision.
            </p>
          </div>
        </section>

        {/* Bento Grid: Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="glass-panel rounded-xl p-6 flex flex-col justify-between min-h-[180px] cyber-glow-hover transition-all group cursor-pointer" onClick={() => document.getElementById('dropzone')?.scrollIntoView({ behavior: 'smooth' })}>
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-primary-fixed-dim/10 text-primary-fixed-dim">
                <span className="material-symbols-outlined">image</span>
              </div>
              <span className="text-[12px] font-bold tracking-widest text-on-surface-variant opacity-50">01</span>
            </div>
            <div>
              <h3 className="text-[24px] font-semibold text-primary group-hover:text-primary-fixed-dim transition-colors">Images</h3>
              <p className="text-on-surface-variant text-[12px] font-bold tracking-widest mt-1">PNG, JPG, WEBP, TIFF</p>
            </div>
          </div>
          
          <div className="glass-panel rounded-xl p-6 flex flex-col justify-between min-h-[180px] cyber-glow-hover transition-all group cursor-pointer" onClick={() => document.getElementById('dropzone')?.scrollIntoView({ behavior: 'smooth' })}>
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-primary-fixed-dim/10 text-primary-fixed-dim">
                <span className="material-symbols-outlined">videocam</span>
              </div>
              <span className="text-[12px] font-bold tracking-widest text-on-surface-variant opacity-50">02</span>
            </div>
            <div>
              <h3 className="text-[24px] font-semibold text-primary group-hover:text-primary-fixed-dim transition-colors">Video</h3>
              <p className="text-on-surface-variant text-[12px] font-bold tracking-widest mt-1">MP4, WEBM, MKV</p>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6 flex flex-col justify-between min-h-[180px] cyber-glow-hover transition-all group cursor-pointer" onClick={() => document.getElementById('dropzone')?.scrollIntoView({ behavior: 'smooth' })}>
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-primary-fixed-dim/10 text-primary-fixed-dim">
                <span className="material-symbols-outlined">audiotrack</span>
              </div>
              <span className="text-[12px] font-bold tracking-widest text-on-surface-variant opacity-50">03</span>
            </div>
            <div>
              <h3 className="text-[24px] font-semibold text-primary group-hover:text-primary-fixed-dim transition-colors">Audio</h3>
              <p className="text-on-surface-variant text-[12px] font-bold tracking-widest mt-1">WAV, FLAC, AAC, MP3</p>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6 flex flex-col justify-between min-h-[180px] cyber-glow-hover transition-all group cursor-pointer" onClick={() => document.getElementById('dropzone')?.scrollIntoView({ behavior: 'smooth' })}>
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-primary-fixed-dim/10 text-primary-fixed-dim">
                <span className="material-symbols-outlined">description</span>
              </div>
              <span className="text-[12px] font-bold tracking-widest text-on-surface-variant opacity-50">04</span>
            </div>
            <div>
              <h3 className="text-[24px] font-semibold text-primary group-hover:text-primary-fixed-dim transition-colors">Docs</h3>
              <p className="text-on-surface-variant text-[12px] font-bold tracking-widest mt-1">PDF, TXT, DOCX, MD</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Drop Zone Area */}
          <div className="lg:col-span-2 space-y-6">
            <div 
              id="dropzone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`glass-panel rounded-xl p-10 border-dashed border-2 flex flex-col items-center justify-center text-center group cursor-pointer transition-all min-h-[340px] ${
                isDragging ? 'border-primary-fixed-dim bg-primary-fixed-dim/10 scale-[1.01]' : 'border-primary-fixed-dim/20 hover:border-primary-fixed-dim/50'
              }`}
            >
              <input type="file" ref={fileInputRef} onChange={(e) => addFiles(e.target.files)} className="hidden" multiple />
              <div className="w-20 h-20 rounded-full bg-primary-fixed-dim/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[40px] text-primary-fixed-dim">upload_file</span>
              </div>
              <h3 className="text-[24px] font-semibold text-primary mb-2">Drop files here to start</h3>
              <p className="text-on-surface-variant max-w-md mx-auto mb-6">Maximum file size: 2GB per upload. Your data is processed securely and directly where possible.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="bg-primary-fixed-dim text-black text-[14px] font-bold px-16 py-4 rounded-full hover:shadow-[0_0_15px_rgba(176,213,0,0.4)] transition-all uppercase tracking-widest active:scale-95"
                >
                  Select Files
                </button>
              </div>
            </div>

            {/* Featured Tech Highlight or Format Selection */}
            <div className="glass-panel rounded-xl flex items-center justify-between p-6">
              {files.length > 0 ? (
                <>
                  <div>
                    <h4 className="text-[24px] font-semibold text-white mb-1">Initiate Conversion</h4>
                    <p className="text-white/70 text-[16px] max-w-lg">Detected {files.length} {commonExt} file(s). Select target format to begin.</p>
                  </div>
                  <div className="flex gap-4">
                    <select
                      value={targetFormat}
                      onChange={(e) => setTargetFormat(e.target.value)}
                      className="bg-surface-container border border-white/10 text-white rounded-lg px-4 py-3 outline-none focus:border-primary-fixed-dim uppercase font-bold tracking-widest text-[12px]"
                    >
                      <option value="">FORMAT</option>
                      {availableFormats.map(fmt => (
                        <option key={fmt} value={fmt}>{fmt}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleConvert}
                      disabled={!targetFormat || files.some(f => f.status === 'converting')}
                      className="bg-primary-fixed-dim text-black font-bold text-[14px] px-8 py-3 rounded-lg hover:shadow-[0_0_15px_rgba(176,213,0,0.4)] transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Convert
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="bg-primary-fixed-dim text-black font-bold tracking-widest text-[10px] px-2 py-0.5 rounded-sm mb-2 inline-block">PRO FEATURE</span>
                    <h4 className="text-[24px] font-semibold text-white mb-1">WASM Accelerated Engine</h4>
                    <p className="text-white/70 text-[16px] max-w-lg">Utilize high-speed browser processing for media assets, bypassing traditional server limits.</p>
                  </div>
                  <span className="material-symbols-outlined text-[64px] text-primary-fixed-dim/20 mr-4">memory</span>
                </>
              )}
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-[520px]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="text-[24px] font-semibold text-primary">Activity</h3>
              <span className="text-primary-fixed-dim font-bold text-[12px] tracking-widest uppercase">{files.length} ITEMS</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {files.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center p-8 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[48px] opacity-20 mb-4">list_alt</span>
                    <p>No activity yet.</p>
                    <p className="text-sm opacity-70">Upload files to begin.</p>
                  </motion.div>
                )}
                
                {files.map(file => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={file.id}
                    className="flex items-center gap-4 p-6 hover:bg-white/[0.03] transition-colors border-l-2 border-transparent hover:border-primary-fixed-dim group"
                  >
                    <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center shrink-0 relative overflow-hidden">
                      {file.status === 'converting' && <div className="absolute bottom-0 left-0 h-1 bg-primary-fixed-dim w-[65%] animate-pulse"></div>}
                      <span className="material-symbols-outlined text-on-surface-variant">{getMaterialIcon(file.file.name.split('.').pop()?.toLowerCase() || null)}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[16px] text-primary truncate">{file.file.name}</h4>
                      <p className="text-[11px] font-bold tracking-widest text-on-surface-variant uppercase mt-1">
                        {file.file.name.split('.').pop()?.toUpperCase()} {file.targetFormat ? `→ ${file.targetFormat.toUpperCase()}` : ''} • {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      {file.status === "pending" && <span className="material-symbols-outlined text-on-surface-variant text-[18px]">schedule</span>}
                      {file.status === "converting" && <span className="material-symbols-outlined text-secondary animate-spin text-[18px]">progress_activity</span>}
                      {file.status === "success" && (
                        <a href={file.downloadUrl} download={`converted_${file.file.name.split('.')[0]}.${file.targetFormat}`} className="hover:scale-110 transition-transform cursor-pointer">
                          <span className="material-symbols-outlined text-primary-fixed-dim text-[24px]" style={{fontVariationSettings: "'FILL' 1"}}>download_circle</span>
                        </a>
                      )}
                      {file.status === "error" && <span className="material-symbols-outlined text-error text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>error</span>}
                      
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                        {file.status === "pending" && "READY"}
                        {file.status === "converting" && "ACTIVE"}
                        {file.status === "success" && "DONE"}
                        {file.status === "error" && "FAILED"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
