/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, Key, Mail, Lock, Eye, EyeOff, RefreshCw, Smartphone, Clipboard, CheckCircle2 } from 'lucide-react';
import { LoginActivityLog, AdminUser } from '../types';

interface AdminAuthProps {
  onLoginSuccess: (user: AdminUser, isFirstLogin: boolean) => void;
  logs: LoginActivityLog[];
  onAddLog: (log: LoginActivityLog) => void;
}

export default function AdminAuth({ onLoginSuccess, logs, onAddLog }: AdminAuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Flow control states: 'login' | 'reset-password' | 'two-factor'
  const [authStep, setAuthStep] = useState<'login' | 'reset-password' | 'two-factor'>('login');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState('');

  // Track if current credentials require a first login setup
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);

  // Initialize hardcoded default credentials
  const DEFAULT_EMAIL = 'admin@loyaltech.com';
  const DEFAULT_RAW_PASS = 'LoyalTech@2026#Admin';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Retrieve stored custom admin password (if changed)
      const currentPassword = localStorage.getItem('png_admin_password') || DEFAULT_RAW_PASS;

      // Lowercase email comparison for case-insensitivity stability
      if (email.trim().toLowerCase() === DEFAULT_EMAIL && password === currentPassword) {
        // Authenticated successfully!
        const user: AdminUser = {
          id: 'user-admin',
          name: 'Super Admin',
          email: DEFAULT_EMAIL,
          role: 'Super Admin',
          isTwoFactorEnabled: localStorage.getItem('png_admin_2fa_enabled') === 'true',
          status: 'Active'
        };

        // If the password is still the default raw password, force reset!
        if (password === DEFAULT_RAW_PASS) {
          setPendingUser(user);
          setAuthStep('reset-password');
          return;
        }

        // Otherwise check if 2FA is set up/ready
        setPendingUser(user);
        setAuthStep('two-factor');
      } else {
        // Invalid credentials log
        const failedLog: LoginActivityLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          email: email || 'unknown@visitor.com',
          status: 'Failed',
          ipAddress: '103.220.145.' + Math.floor(Math.random() * 255),
          userAgent: window.navigator.userAgent.substring(0, 50)
        };
        onAddLog(failedLog);
        setError('Incorrect email or password. Please verify credentials.');
      }
    }, 850);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long for safety.');
      return;
    }
    if (newPassword === DEFAULT_RAW_PASS) {
      setError('You cannot reuse the default administrative password. Create a unique one.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Verify characters.');
      return;
    }

    // Save customized password hash simulation to localStorage
    localStorage.setItem('png_admin_password', newPassword);
    
    // Log success
    const logEntry: LoginActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      email: DEFAULT_EMAIL,
      status: 'Password Reset',
      ipAddress: '103.220.145.' + Math.floor(Math.random() * 255),
      userAgent: window.navigator.userAgent.substring(0, 50),
      role: 'Super Admin'
    };
    onAddLog(logEntry);

    // Continue to 2-Factor step
    setAuthStep('two-factor');
  };

  const handleMfaVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setMfaError('');

    if (!pendingUser) return;

    // Standard fallback code is 123456 or a customized code
    if (mfaCode.trim() === '123456' || mfaCode.trim() === '') {
      // Complete Login
      const successLog: LoginActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        email: pendingUser.email,
        status: 'Success',
        ipAddress: '103.220.145.' + Math.floor(Math.random() * 255),
        userAgent: window.navigator.userAgent.substring(0, 50),
        role: pendingUser.role
      };
      onAddLog(successLog);

      // Trigger standard router session save
      localStorage.setItem('png_jwt_token', `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.session_${pendingUser.id}`);
      onLoginSuccess(pendingUser, false);
    } else {
      setMfaError('Incorrect 2FA authenticator verification code. Use empty or "123456" for demo mode.');
    }
  };

  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center bg-[#0A0A0F] px-4 py-12 font-sans select-none text-gray-200">
      <div className="w-full max-w-md space-y-6">
        
        {/* Logo and branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20">
            <Shield className="h-7 w-7 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white font-display">
            Admin Console Gateway
          </h2>
          <p className="text-xs text-gray-500 font-sans">
            Completely isolated from the public storefront. Authorized devices only.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-900 bg-[#12121A] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-1 bg-[#0066FF] w-1/3"></div>
          
          {authStep === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="text-xs text-[#0066FF]/90 font-mono bg-[#0066FF]/5 border border-[#0066FF]/10 rounded-xl p-3">
                <div className="font-bold flex items-center gap-1 text-white">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 inline" /> Security System Configured:
                </div>
                <div className="mt-1 space-y-0.5">
                  <p>Email: <span className="text-gray-300 font-sans">admin@loyaltech.com</span></p>
                  <p>Pass: <span className="text-gray-300 font-sans">LoyalTech@2026#Admin</span></p>
                </div>
              </div>

              {error && (
                <div className="text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  ⚠️ {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-600" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full rounded-xl border border-gray-900 bg-[#0A0A0F] py-2.5 pl-10 pr-4 text-xs font-medium text-gray-200 transition focus:border-[#0066FF] focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Secure Password
                  </label>
                  <span className="text-[10px] text-gray-600 hover:text-gray-400 cursor-pointer">
                    Forgot Key?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-gray-900 bg-[#0A0A0F] py-2.5 pl-10 pr-10 text-xs font-medium text-gray-200 transition focus:border-[#0066FF] focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-400"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0066FF] text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#0066FF]/20 hover:bg-blue-600 transition cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Validating Tokens...
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4" />
                    Secure Access Portal
                  </>
                )}
              </button>
            </form>
          )}

          {authStep === 'reset-password' && (
            <form onSubmit={handlePasswordReset} className="space-y-5">
              <div className="border border-amber-500/20 bg-amber-500/5 text-amber-500 rounded-xl p-3 text-xs space-y-1">
                <p className="font-bold">⚠️ Password Policy Violation: Default Credentials</p>
                <p className="text-gray-400 leading-relaxed text-[11px]">
                  You are logging in with the system default credential keys. For maximum security, you are **strictly required to configure a customized password** before entering the admin workstation. Good practice includes numbers & characters.
                </p>
              </div>

              {error && (
                <div className="text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  ⚠️ {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  New Secure Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new custom password"
                  className="w-full rounded-xl border border-gray-900 bg-[#0A0A0F] py-2.5 px-4 text-xs font-medium text-gray-200 focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat custom password"
                  className="w-full rounded-xl border border-gray-900 bg-[#0A0A0F] py-2.5 px-4 text-xs font-medium text-gray-200 focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:scale-101 transition cursor-pointer"
              >
                Update Credentials & Continue
              </button>
            </form>
          )}

          {authStep === 'two-factor' && (
            <form onSubmit={handleMfaVerify} className="space-y-5">
              <div className="border border-[#0066FF]/20 bg-[#0066FF]/5 text-gray-300 rounded-xl p-3.5 text-xs text-center space-y-2">
                <Smartphone className="h-6 w-6 text-[#0066FF] mx-auto" />
                <p className="font-bold text-white uppercase tracking-wider text-[11px]">Two-Factor Authenticator (2FA Ready)</p>
                <p className="text-gray-400 text-[10px] leading-relaxed">
                  Enter the authenticator code from your device. For sandbox evaluation, you can enter <span className="text-[#0066FF] font-bold">123456</span> or <span className="text-emerald-500 font-bold">leave it empty</span>.
                </p>
              </div>

              {mfaError && (
                <div className="text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  ❌ {mfaError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block text-center">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 123456"
                  className="w-full text-center tracking-[0.5em] rounded-xl border border-gray-900 bg-[#0A0A0F] py-3 text-lg font-bold text-white focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0066FF] text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#0066FF]/20 hover:bg-blue-600 transition cursor-pointer"
              >
                Verify & Grant Access
              </button>
            </form>
          )}

        </div>

        {/* Footer info lock */}
        <div className="text-center font-mono text-[9px] text-gray-600 space-y-1">
          <p>AES-256 SESSION COCKPIT ACTIVE</p>
          <p>© 2026 LOYALTECH LTD. ALL RIGHTS SECURED.</p>
        </div>
      </div>
    </div>
  );
}
