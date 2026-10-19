// pages/auth/Register.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const initialForm = {
  name: '',
  businessName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  accountType: 'BUSINESS_OWNER',
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Full name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 8) next.password = 'Password must be at least 8 characters.';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await register({
        name: form.name.trim(),
        businessName: form.businessName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: form.accountType,
      });
      toast.success(`Welcome to Hirely, ${user.name.split(' ')[0]}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="card w-full max-w-md p-8">
          <h1 className="font-display text-xl font-bold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">Create your account and make great work happen.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-100 p-1">
              {[
                { value: 'BUSINESS_OWNER', label: 'Business Owner' },
                { value: 'FREELANCER', label: 'Freelancer' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, accountType: opt.value })}
                  className={`rounded-md py-2 text-sm font-medium transition-colors ${
                    form.accountType === opt.value ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">Full name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-2 ${errors.name ? 'border-danger focus:ring-red-100' : 'border-slate-300 focus:border-primary-500 focus:ring-primary-100'}`} />
              {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="businessName" className="mb-1.5 block text-sm font-medium text-ink">Business name</label>
              <input id="businessName" name="businessName" value={form.businessName} onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-2 ${errors.email ? 'border-danger focus:ring-red-100' : 'border-slate-300 focus:border-primary-500 focus:ring-primary-100'}`} />
                {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">Phone</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">Password</label>
                <input id="password" name="password" type="password" value={form.password} onChange={handleChange}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-2 ${errors.password ? 'border-danger focus:ring-red-100' : 'border-slate-300 focus:border-primary-500 focus:ring-primary-100'}`} />
                {errors.password && <p className="mt-1 text-xs text-danger">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-ink">Confirm password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-2 ${errors.confirmPassword ? 'border-danger focus:ring-red-100' : 'border-slate-300 focus:border-primary-500 focus:ring-primary-100'}`} />
                {errors.confirmPassword && <p className="mt-1 text-xs text-danger">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
