/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, Trash2, ArrowLeft, ArrowRight, RefreshCw, FileImage, ShieldAlert } from 'lucide-react';

interface ProductImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ProductImageUploader({ images, onChange }: ProductImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cloudinary configuration
  const uploadFileToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    // First try a highly active public developer endpoint
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dgy76pxu8/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Cloudinary primary upload failed with status: ${response.status} - ${errText}`);
      }

      const data = await response.json();
      if (data && data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error('Cloudinary response did not contain secure_url');
      }
    } catch (err: any) {
      console.warn('[IMAGE-UPLOAD-WARN] Cloudinary primary upload failed, trying backup...', err.message);
      
      // Try a secondary highly active backup endpoint (draftbit)
      try {
        const backupResponse = await fetch('https://api.cloudinary.com/v1_1/draftbit/image/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (backupResponse.ok) {
          const backupData = await backupResponse.json();
          if (backupData && backupData.secure_url) {
            return backupData.secure_url;
          }
        }
      } catch (backupErr: any) {
        console.error('[IMAGE-UPLOAD-ERROR] Cloudinary backup upload failed as well:', backupErr.message);
      }

      // If both fail, fall back to Base64 (safely allows offline preview but raises warning logs)
      console.warn('[IMAGE-UPLOAD-FALLBACK] Falling back to base64 encoding due to network constraints.');
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleFiles = async (fileList: FileList) => {
    setErrorMsg('');
    const validFiles: File[] = [];
    
    // Check total limit (max 5 images)
    const currentCount = images.length;
    const remainingSlots = 5 - currentCount;
    
    if (remainingSlots <= 0) {
      setErrorMsg('Limit reached. A product can have a maximum of 5 images.');
      return;
    }

    const filesArray = Array.from(fileList);
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    for (const file of filesArray) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg(`"${file.name}" exceeds the 5MB size limit.`);
        continue;
      }
      
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        setErrorMsg(`"${file.name}" is not a supported format (JPG, PNG, WEBP only).`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Slice to remaining slots
    const filesToProcess = validFiles.slice(0, remainingSlots);
    if (validFiles.length > remainingSlots) {
      setErrorMsg(`Only the first ${remainingSlots} valid image(s) were added due to the 5 images limit.`);
    }

    setUploading(true);
    try {
      const uploadPromises = filesToProcess.map((f) => uploadFileToCloudinary(f));
      const urls = await Promise.all(uploadPromises);
      onChange([...images, ...urls]);
    } catch (err: any) {
      console.error('[UPLOAD-EXCEPTION] Fatal uploading error:', err);
      setErrorMsg('Failed to process and upload one or more images.');
    } finally {
      setUploading(false);
    }
  };

  // Drag listeners
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Drop listener
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Actions
  const handleDeleteImage = (indexToDelete: number) => {
    const updated = images.filter((_, idx) => idx !== indexToDelete);
    onChange(updated);
  };

  const handleMoveLeft = (idx: number) => {
    if (idx === 0) return;
    const updated = [...images];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    onChange(updated);
  };

  const handleMoveRight = (idx: number) => {
    if (idx === images.length - 1) return;
    const updated = [...images];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    onChange(updated);
  };

  const handleReplaceImage = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(`"${file.name}" exceeds the 5MB size limit.`);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg(`"${file.name}" format is unsupported.`);
      return;
    }

    setUploading(true);
    setErrorMsg('');
    try {
      const url = await uploadFileToCloudinary(file);
      const updated = [...images];
      updated[idx] = url;
      onChange(updated);
    } catch (err: any) {
      console.error('[REPLACE-IMAGE-ERROR] Replacement upload failed:', err);
      setErrorMsg('Failed to upload replacement image to secure cloud storage.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-gray-900">
        <div>
          <label className="text-[11px] uppercase font-bold text-[#FF6B00] block">
            Media Gallery Manager
          </label>
          <span className="text-[10px] text-gray-500 font-medium">
            Upload between 1 to 5 images. Drag to drop or browse files.
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold bg-[#12121A] border border-gray-800 px-2 py-0.5 rounded text-gray-400">
          {images.length}/5 Images
        </span>
      </div>

      {uploading && (
        <div className="flex items-center gap-2 rounded-lg bg-[#0066FF]/10 border border-[#0066FF]/20 p-3 text-[11px] text-[#0066FF] font-sans">
          <RefreshCw className="h-4 w-4 shrink-0 text-[#0066FF] animate-spin" />
          <span>Uploading images to secure Cloud Storage bucket... Please wait.</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-[11px] text-red-400 font-sans">
          <ShieldAlert className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Drag & Drop Area */}
      {images.length < 5 && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          disabled={uploading}
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition cursor-pointer select-none ${
            uploading ? 'pointer-events-none opacity-50' : ''
          } ${
            dragActive
              ? 'border-[#0066FF] bg-[#0066FF]/5'
              : 'border-gray-800 bg-[#07070B] hover:border-gray-700'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <Upload className={`h-8 w-8 mb-2 ${dragActive ? 'text-[#0066FF] animate-bounce' : 'text-gray-500'}`} />
          <p className="text-[11px] font-bold text-gray-300">
            {dragActive ? 'Drop images here' : 'Click or Drag & Drop multiple files here'}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">
            JPG, PNG, or WEBP up to 5MB. Select up to {5 - images.length} remaining slots.
          </p>
        </div>
      )}

      {/* Preview Section */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {images.map((img, idx) => {
            const isFeatured = idx === 0;
            return (
              <div
                key={idx}
                className={`group relative rounded-xl border overflow-hidden bg-[#0A0A10] p-1.5 transition ${
                  isFeatured 
                    ? 'border-[#0066FF]/70 shadow-lg shadow-[#0066FF]/5' 
                    : 'border-gray-950'
                }`}
              >
                {/* Visual Label */}
                <div className={`absolute top-2 left-2 z-10 rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                  isFeatured ? 'bg-[#0066FF] text-white' : 'bg-gray-900 text-gray-400'
                }`}>
                  {isFeatured ? 'Featured' : `Gallery #${idx}`}
                </div>

                {/* Main image container */}
                <div className="aspect-square w-full rounded-lg overflow-hidden bg-[#12121A] border border-gray-950 relative">
                  <img
                    src={img}
                    alt={`Preview #${idx}`}
                    className="h-full w-full object-contain"
                  />
                  
                  {/* Overlay action tools */}
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150 gap-2">
                    {/* Replace Tool */}
                    <label className="flex items-center gap-1.5 rounded-md bg-gray-900 border border-gray-800 px-2 py-1 text-[9px] font-bold text-gray-300 cursor-pointer hover:bg-gray-800 transition">
                      <RefreshCw className="h-3 w-3 text-[#FF6B00]" />
                      <span>Replace</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={(e) => handleReplaceImage(idx, e)}
                        className="hidden"
                      />
                    </label>

                    {/* Delete Tool */}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(idx)}
                      className="flex items-center gap-1.5 rounded-md bg-red-950/80 border border-red-800/20 px-2 py-1 text-[9px] font-bold text-red-400 hover:bg-red-950 transition cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Under footer navigation controls (Reordering) */}
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-900/65">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveLeft(idx)}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500 transition"
                    title="Move Left"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[9px] font-mono text-gray-600 font-bold">
                    Order {idx + 1}
                  </span>
                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={() => handleMoveRight(idx)}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500 transition"
                    title="Move Right"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
