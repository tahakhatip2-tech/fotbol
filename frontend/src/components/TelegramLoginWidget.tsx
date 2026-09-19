import React, { useEffect, useRef } from 'react';
import { Button } from './ui/Button';
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginWidgetProps {
  botName: string;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: string;
  usePic?: boolean;
  onAuth: (user: TelegramUser) => void;
}

export const TelegramLoginWidget: React.FC<TelegramLoginWidgetProps> = ({
  botName,
  buttonSize = 'large',
  cornerRadius = 20,
  requestAccess = 'write',
  usePic = true,
  onAuth,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!botName || botName === 'your_bot_username_here') {
      return;
    }

    // @ts-ignore
    window.TelegramLoginWidget = {
      dataOnauth: (user: TelegramUser) => {
        onAuth(user);
      }
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', buttonSize);
    if (cornerRadius !== undefined) {
      script.setAttribute('data-radius', cornerRadius.toString());
    }
    script.setAttribute('data-request-access', requestAccess);
    script.setAttribute('data-userpic', usePic.toString());
    script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
    script.async = true;

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
         containerRef.current.innerHTML = '';
      }
    };
  }, [botName, buttonSize, cornerRadius, requestAccess, usePic, onAuth]);

  if (!botName || botName === 'your_bot_username_here') {
      return (
        <Button 
          variant="outline" 
          className="w-full h-9 text-xs border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-all font-medium backdrop-blur-sm"
          onClick={(e) => { e.preventDefault(); alert('قيد التطوير'); }}
          type="button"
        >
          <svg className="w-4 h-4 mr-1.5 ml-1.5 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.285-.346-.09l-6.4 4.024-2.76-.86c-.6-.185-.613-.6.125-.89l10.736-4.133c.5-.186.953.106.825.99z"/></svg>
          الدخول بواسطة تيليجرام
        </Button>
      )
  }

  return <div ref={containerRef} className="flex justify-center" />;
};
