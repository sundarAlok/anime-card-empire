import { useAuth } from "../context/useAuth";
import { FcGoogle } from "react-icons/fc";
import "../styles/AuthOverlay.css";

const AuthOverlay = ({ isOpen, onClose }) => {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error("Sign-in failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-overlay-backdrop" onClick={onClose}>
      <div className="auth-overlay-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-overlay-close" onClick={onClose}>×</button>
        
        <div className="auth-overlay-header">
          <h2 className="auth-overlay-title">Sign In</h2>
          <p className="auth-overlay-subtitle">Save your progress to the cloud</p>
        </div>

        <div className="auth-overlay-divider"></div>

        <div className="auth-overlay-body">
          <p className="auth-overlay-description">
            Sign in with your Google account to:
          </p>
          <ul className="auth-overlay-benefits">
            <li className="auth-benefit-item">
              <span className="benefit-icon">☁️</span>
              <span className="benefit-text">Save your progress across devices</span>
            </li>
            <li className="auth-benefit-item">
              <span className="benefit-icon">🎮</span>
              <span className="benefit-text">Keep your cards and NFTs safe</span>
            </li>
            <li className="auth-benefit-item">
              <span className="benefit-icon">⭐</span>
              <span className="benefit-text">Sync your coins and stars</span>
            </li>
          </ul>
        </div>

        <button 
          className="auth-google-signin-btn"
          onClick={handleGoogleSignIn}
        >
          <FcGoogle className="google-icon" />
          <span className="auth-google-text">Sign in with Google</span>
        </button>

        <p className="auth-overlay-footer">
          Your data is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default AuthOverlay;
