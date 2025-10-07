"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }: { error?: Error }) {
  const { lang } = useLanguage();

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-color)',
      borderRadius: '0.5rem',
      margin: '2rem',
      border: '1px solid var(--border-color)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
      <h2 style={{ marginBottom: '1rem', color: 'var(--text-color)' }}>
        {lang.errorOccurred || 'Bir hata oluştu'}
      </h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-color)', opacity: 0.8 }}>
        {lang.errorMessage || 'Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.'}
      </p>
      
      {process.env.NODE_ENV === 'development' && error && (
        <details style={{ 
          marginBottom: '2rem', 
          padding: '1rem', 
          backgroundColor: 'var(--secondary-bg)', 
          borderRadius: '0.25rem',
          textAlign: 'left',
          maxWidth: '600px',
          width: '100%'
        }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            Hata Detayları (Geliştirici Modu)
          </summary>
          <pre style={{ 
            marginTop: '1rem', 
            fontSize: '0.875rem', 
            overflow: 'auto',
            color: '#ef4444'
          }}>
            {error.toString()}
          </pre>
        </details>
      )}

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleReload}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#137fec',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          {lang.reloadPage || 'Sayfayı Yenile'}
        </button>
        <button
          onClick={handleGoHome}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: 'var(--text-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          {lang.goHome || 'Ana Sayfaya Dön'}
        </button>
      </div>
    </div>
  );
}

export default function ErrorBoundary({ children, fallback }: Props) {
  return (
    <ErrorBoundaryClass fallback={fallback}>
      {children}
    </ErrorBoundaryClass>
  );
}
