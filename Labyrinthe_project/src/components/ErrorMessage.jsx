import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="error-message">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <p>{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;