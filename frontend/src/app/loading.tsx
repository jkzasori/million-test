export default function Loading() {
  return (
    <>
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2 className="loading-title">Loading Million Properties</h2>
          <p className="loading-subtitle">Preparing your premium property experience...</p>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .loading-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }

          .loading-content {
            text-align: center;
            color: white;
            max-width: 400px;
            padding: var(--spacing-xl);
          }

          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(201, 169, 110, 0.2);
            border-top: 3px solid #c9a96e;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto var(--spacing-lg);
          }

          .loading-title {
            font-family: var(--font-display);
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: var(--spacing-md);
            color: #c9a96e;
          }

          .loading-subtitle {
            font-family: var(--font-primary);
            font-size: 0.875rem;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.5;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </>
  );
}