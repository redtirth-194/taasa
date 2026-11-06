import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAdmin, openLoginModal, demoLogin } = useAuth();

  if (!isAdmin) {
    return (
      <div style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #1c141a 0%, #2e1d29 100%)',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '520px',
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(251, 111, 146, 0.3)',
          borderRadius: '24px',
          padding: '44px 36px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(251, 111, 146, 0.15)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(251, 111, 146, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '1px solid rgba(251, 111, 146, 0.5)',
            color: '#ff8fab'
          }}>
            <Lock size={28} />
          </div>

          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#ff8fab',
            display: 'block',
            marginBottom: '8px'
          }}>
            RESTRICTED ACCESS AREA
          </span>

          <h2 style={{
            fontFamily: 'var(--font-family-serif)',
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '12px',
            color: '#ffffff'
          }}>
            Admin Authorization Required
          </h2>

          <p style={{
            fontSize: '14px',
            color: '#c4b5c0',
            lineHeight: 1.6,
            marginBottom: '28px'
          }}>
            {user 
              ? `You are currently logged in as a Customer (${user.email}). Only administrators with designated credentials can access the Taasa CMS panel.`
              : 'This portal is restricted to authorized Taasa store management. Please authenticate with administrator privileges to proceed.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              className="btn btn-cute-pink"
              style={{ width: '100%', padding: '14px', fontSize: '14px' }}
              onClick={() => demoLogin('admin')}
            >
              <span>👑 Authenticate as Admin (1-Click)</span>
            </button>

            <button 
              className="btn btn-secondary"
              style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', borderColor: 'rgba(255, 255, 255, 0.2)' }}
              onClick={openLoginModal}
            >
              <span>Sign In with Credentials</span>
            </button>

            <Link 
              to="/" 
              style={{
                marginTop: '8px',
                fontSize: '13px',
                color: '#8c7d87',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <ArrowLeft size={14} /> Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
