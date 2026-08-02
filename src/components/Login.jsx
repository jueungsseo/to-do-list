import React, { useState } from 'react';
import { Check, Facebook, Lock, Mail, X } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const initialFormData = {
  email: '',
  password: '',
};

const translateAuthMessage = (message) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('invalid login credentials')) {
    return '이메일 또는 비밀번호가 올바르지 않습니다.';
  }
  if (lowerMessage.includes('email not confirmed')) {
    return '이메일 인증을 완료한 뒤 로그인해주세요.';
  }
  if (lowerMessage.includes('rate limit')) {
    return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
  }

  return message;
};

const InputGroup = ({ icon: Icon, name, type = 'text', placeholder, value, onChange }) => {
  return (
    <label className="group flex items-center gap-4 rounded-xl border border-slate-400 bg-white px-4 py-4 transition focus-within:border-[#FF5F5E] focus-within:ring-4 focus-within:ring-[#FF5F5E]/10">
      <Icon className="h-5 w-5 shrink-0 text-slate-900 transition group-focus-within:text-[#FF5F5E]" />
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
      />
    </label>
  );
};

export const Login = ({ onLogin, onOpenSignUp }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setMessage('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setMessage('Supabase 환경변수가 설정되지 않았습니다.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email.trim(),
      password: formData.password,
    });

    setIsSubmitting(false);

    if (error) {
      setMessage(translateAuthMessage(error.message));
      return;
    }

    onLogin({ rememberMe, user: data.user });
  };

  return (
    <main className="min-h-screen bg-[#FF6F73] bg-[radial-gradient(circle_at_1px_1px,rgba(180,45,55,0.22)_1px,transparent_0)] bg-[length:34px_34px] p-4 sm:p-8 lg:p-12">
      <section className="mx-auto flex min-h-[720px] max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl lg:flex-row">
        <div className="flex flex-1 items-center p-8 sm:p-12 lg:p-14">
          <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-6">
            <h1 className="text-4xl font-extrabold tracking-normal text-slate-900">로그인</h1>

            <div className="space-y-5">
              <InputGroup
                icon={Mail}
                name="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={handleInputChange}
              />
              <InputGroup
                icon={Lock}
                name="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <label className="flex w-fit items-center gap-4 text-sm font-medium text-slate-800">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#FF5F5E] focus:ring-[#FF5F5E]"
              />
              <span>로그인 상태 유지</span>
            </label>

            {message && <p className="text-sm font-semibold text-red-500">{message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[#FF8585] px-10 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#FF5F5E] focus:outline-none focus:ring-4 focus:ring-[#FF5F5E]/25"
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>

            <div className="space-y-3 pt-10">
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-800">
                <span>간편 로그인</span>
                <button type="button" className="text-[#3B5998]" aria-label="페이스북으로 로그인">
                  <Facebook className="h-7 w-7 fill-current" />
                </button>
                <button type="button" className="font-bold text-[#4285F4]" aria-label="구글로 로그인">
                  G
                </button>
                <button
                  type="button"
                  className="grid h-7 w-7 place-items-center rounded-md bg-black text-white"
                  aria-label="X로 로그인"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm font-medium text-slate-800">
                아직 계정이 없나요?{' '}
                <button
                  type="button"
                  onClick={onOpenSignUp}
                  className="font-semibold text-[#008FE8] hover:text-[#006EB8]"
                >
                  회원가입
                </button>
              </p>
            </div>
          </form>
        </div>

        <div className="flex flex-1 items-center justify-center p-8 sm:p-12">
          <div className="relative flex min-h-[420px] w-full max-w-lg items-center justify-center rounded-lg bg-gray-100">
            <div className="absolute h-80 w-80 rounded-full bg-slate-200/70" />
            <div className="relative h-96 w-44 rounded-2xl bg-[#4E81D7] p-4 shadow-xl">
              <div className="mx-auto mb-3 h-1 w-16 rounded-full bg-[#2F5EAE]" />
              <div className="h-full rounded-sm bg-white p-7">
                <div className="mx-auto mt-14 grid h-12 w-12 place-items-center rounded-full bg-emerald-300 text-white">
                  <Check className="h-8 w-8 stroke-[4]" />
                </div>
                <div className="mt-20 rounded-md bg-[#4E94EA] p-3">
                  <div className="mb-3 h-2 w-24 rounded-full bg-[#2467BB]" />
                  <div className="space-y-2">
                    <div className="h-3 w-16 rounded bg-blue-200" />
                    <div className="h-3 w-24 rounded bg-blue-200" />
                    <div className="h-3 w-20 rounded bg-blue-200" />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative ml-4 mt-20 hidden h-80 w-32 rounded-full bg-[#FF7C98] sm:block">
              <div className="absolute -left-10 bottom-0 h-40 w-32 rounded-full bg-purple-400" />
              <div className="absolute left-8 top-16 h-52 w-16 rounded-full bg-[#3F4DA1]" />
              <div className="absolute left-14 top-4 h-14 w-14 rounded-full bg-[#1F376E]" />
              <div className="absolute left-12 top-16 h-20 w-20 rounded-2xl bg-[#5156B0]" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
