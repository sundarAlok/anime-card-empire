import { useAuth } from "../context/useAuth";
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
          <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#EA4335" d="M5.26620003,9.78002398 C6.03878775,6.91417286 8.54821079,4.73072396 11.4625454,4.73072396 C13.0455287,4.73072396 14.1545589,5.3107393 15.4545181,6.51269541 L18.541527,3.47566121 C16.4830231,1.33871231 13.7461342,0 11.4625454,0 C7.31498555,0 3.70073232,2.47267867 2.13171969,6.02359503 L5.26620003,9.78002398 Z"/>
            <path fill="#34A853" d="M15.5343865,12.1545731 C15.1509771,11.1331928 14.5745969,10.3066433 13.7961845,9.8059567 L10.9456969,12.5693938 C11.7870016,13.1987782 12.3854808,14.0960385 12.3854808,15.2588587 C12.3854808,15.5370164 12.359036,15.8012683 12.3039358,16.0496619 L15.5343865,12.1545731 Z"/>
            <path fill="#4285F4" d="M5.26620003,9.78002398 L2.13171969,6.02359503 C1.04766404,7.94393605 0.4,9.90936089 0.4,12 C0.4,14.0906391 1.04766404,15.9560395 2.13171969,17.9764049 L5.29528773,14.1145495 C5.1238245,13.6946564 5.03236745,13.2289141 5.03236745,12.7581431 C5.03236745,12.2873721 5.12382445,11.8216298 5.26620003,9.78002398 Z"/>
            <path fill="#FBBC05" d="M16.6684835,14.6296428 C16.8596426,13.7243011 17.0057722,12.5888175 17.0057722,11.4081618 L17.0057722,11.196833 L13.6620915,11.196833 L13.6620915,15.2588587 C13.6620915,16.5064882 13.4157365,17.7632245 12.9269936,18.9159968 L16.6684835,14.6296428 Z"/>
            <path fill="#EA4335" d="M5.26620003,9.78002398 C5.33765899,9.36931024 5.35889894,8.94669086 5.35889894,8.5 C5.35889894,8.05330914 5.33765899,7.63068976 5.26620003,7.22 L2.00151304,11.0151496 C1.93268715,12.6946569 1.93268715,14.3053431 2.00151304,15.9848504 L5.26620003,9.78002398 Z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="auth-overlay-footer">
          Your data is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default AuthOverlay;
