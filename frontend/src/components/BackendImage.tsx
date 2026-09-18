import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../api/axios';
import { ShieldHalf } from 'lucide-react';

interface BackendImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
}

export const BackendImage: React.FC<BackendImageProps> = ({ src, alt, className, fallbackIcon }) => {
  const [imgData, setImgData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    if (!src) {
      if (isMounted) setLoading(false);
      return;
    }
    
    // If it's a local object URL (like preview during file selection) or an external http URL, use it directly
    if (src.startsWith('blob:') || src.startsWith('http')) {
      if (isMounted) {
        setImgData(src);
        setLoading(false);
      }
      return;
    }

    const fetchImage = async () => {
      try {
        const url = getImageUrl(src);
        const res = await api.get(url, { responseType: 'blob' });
        if (isMounted) {
          const objectUrl = URL.createObjectURL(res.data);
          setImgData(objectUrl);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load image', err);
        if (isMounted) setLoading(false);
      }
    };

    fetchImage();

    return () => { 
      isMounted = false; 
    };
  }, [src]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center animate-pulse bg-white/5 ${className}`}>
        {/* Loading placeholder */}
      </div>
    );
  }

  if (!src || !imgData) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        {fallbackIcon || <ShieldHalf size={28} className="text-muted-foreground" />}
      </div>
    );
  }

  return <img src={imgData} alt={alt} className={className} />;
};
