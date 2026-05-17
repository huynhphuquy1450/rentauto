'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface ImageUploadProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

const DEFAULT_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageUpload({
  value,
  onChange,
  maxSizeMB = 2,
  acceptedTypes = DEFAULT_TYPES,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!acceptedTypes.includes(file.type)) {
      const msg = `Chỉ chấp nhận: ${acceptedTypes.map((t) => t.split('/')[1]).join(', ')}`;
      setError(msg);
      toast.error(msg);
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      const msg = `Ảnh vượt quá ${maxSizeMB}MB (hiện tại ${sizeMB.toFixed(2)}MB)`;
      setError(msg);
      toast.error(msg);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview(undefined);
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFile}
        className="hidden"
        data-testid="image-upload-input"
      />

      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="preview"
            className="w-full max-h-48 object-cover rounded-xl border dark:border-gray-600"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600"
            aria-label="Xóa ảnh"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-colors"
        >
          <Upload className="w-8 h-8 mb-2" />
          <span className="font-medium">Tải ảnh lên</span>
          <span className="text-xs mt-1">
            {acceptedTypes.map((t) => t.split('/')[1]).join(', ')} · tối đa {maxSizeMB}MB
          </span>
        </button>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
