/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Key, Mail, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { AdminUser, LoginActivityLog } from '../types';

interface AdminAuthProps {
  onLoginSuccess: (user: AdminUser, isFirstLogin: boolean) => void;
  // Kept in props signature for absolute backward-compatibility, but unused
  logs?: LoginActivityLog[];
  onAddLog?: (log: LoginActivityLog) => void;
}

export default function AdminAuth({ onLoginSuccess }: AdminAuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple direct handler that authenticates through our secure backend API
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid administrator credentials.');
      }

      // Save token to session/local storage
      localStorage.setItem('png_jwt_token', data.token);

      // Successfully authenticated! Direct redirect to Dashboard
      onLoginSuccess(data.user, false);
    } catch (err: any) {
      setError(err.message || 'Authentication service failed. Verify connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="admin-auth-container" className="flex min-h-[650px] flex-col items-center justify-center bg-[#07070B] px-4 py-16 font-sans select-none text-gray-200">
      <div id="admin-auth-box" className="w-full max-w-md space-y-8">
        
        {/* Branding header */}
        <div id="admin-auth-brand" className="text-center space-y-3">
          <div id="admin-auth-shield" className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20">
            <Shield className="h-7 w-7" />
          </div>
          <h2 id="admin-auth-title" className="text-2xl font-black uppercase tracking-tight text-white font-display">
            Admin Workspace Login
          </h2>
          <p id="admin-auth-subtitle" className="text-xs text-gray-400 font-sans">
            Secure administrative control portal. Authorized personnel only.
          </p>
        </div>

        {/* Clear login card */}
        <div id="admin-auth-card" className="rounded-2xl border border-gray-900 bg-[#101017] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div id="admin-auth-accent-line" className="absolute top-0 right-0 h-1.5 bg-[#0066FF] w-1/2"></div>
          
          <form id="admin-auth-form" onSubmit={handleLoginSubmit} className="space-y-6">
            
            {/* Info notification with credentials info to assist user */}
            <div id="admin-credentials-hint" className="text-[11px] text-[#0066FF]/95 font-mono bg-[#0066FF]/5 border border-[#0066FF]/20 rounded-xl p-3.5 space-y-1">
              <span className="font-bold block text-white">Default Admin Credentials:</span>
              <p>Email: <span className="text-gray-300 font-sans">admin@lplugngo.com</span></p>
              <p>Pass: <span className="text-gray-300 font-sans">Admin123456</span></p>
            </div>

            {error && (
              <div id="admin-auth-error" className="text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                ⚠️ {error}
              </div>
            )}

            {/* Email input field */}
            <div id="admin-email-field" className="space-y-2">
              <label htmlFor="admin-email-input" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
                <input
                  id="admin-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@lplugngo.com"
                  className="w-full rounded-xl border border-gray-900 bg-[#07070B] py-3 pl-11 pr-4 text-xs font-medium text-gray-100 transition focus:border-[#0066FF] focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                />
              </div>
            </div>

            {/* Password input field */}
            <div id="admin-password-field" className="space-y-2">
              <label htmlFor="admin-password-input" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                Administrator Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-gray-900 bg-[#07070B] py-3 pl-11 pr-11 text-xs font-medium text-gray-100 transition focus:border-[#0066FF] focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                />
                <button
                  id="admin-password-toggle"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-500 hover:text-gray-300 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              id="admin-login-button"
              type="submit"
              disabled={loading}
              className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0066FF] text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#0066FF]/20 hover:bg-blue-600 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        {/* Console footer metadata */}
        <div id="admin-auth-footer" className="text-center font-mono text-[9px] text-gray-600">
          <p>© 2026 L-PLUG&GO ADMIN WORKSTATION.</p>
        </div>
      </div>
    </div>
  );
}
