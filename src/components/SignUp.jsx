import React, { useState } from 'react';
import {
  AtSign,
  Lock,
  Mail,
  User,
  UserRoundPlus,
  Users,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const initialFormData = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const translateAuthMessage = (message) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('signups not allowed')) {
    return '현재 회원가입이 허용되어 있지 않습니다. Supabase 설정을 확인해주세요.';
  }
  if (lowerMessage.includes('already registered') || lowerMessage.includes('already been registered')) {
    return '이미 가입된 이메일입니다. 로그인해주세요.';
  }
  if (lowerMessage.includes('password')) {
    return '비밀번호 조건을 확인해주세요.';
  }
  if (lowerMessage.includes('rate limit')) {
    return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
  }

  return message;
};

const InputGroup = ({ icon: Icon, name, type = 'text', placeholder, value, onChange }) => {
  return (
    <label className="group flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3.5 transition focus-within:border-[#FF5F5E] focus-within:ring-4 focus-within:ring-[#FF5F5E]/10">
      <Icon className="h-5 w-5 shrink-0 text-slate-800 transition group-focus-within:text-[#FF5F5E]" />
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

export const SignUp = ({ onOpenSignIn }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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

    if (formData.password !== formData.confirmPassword) {
      setMessage('비밀번호가 서로 일치하지 않습니다.');
      return;
    }

    if (!agreedToTerms) {
      setMessage('약관에 동의해야 가입할 수 있습니다.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setMessage('Supabase 환경변수가 설정되지 않았습니다.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          username: formData.username.trim(),
        },
      },
    });

    if (error) {
      setIsSubmitting(false);
      setMessage(translateAuthMessage(error.message));
      return;
    }

    if (data.user && data.session) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
      });

      if (profileError) {
        setIsSubmitting(false);
        setMessage('프로필 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        return;
      }
    }

    setIsSubmitting(false);
    setMessage(
      data.session
        ? '가입이 완료되었습니다. 이제 로그인할 수 있어요.'
        : '가입이 완료되었습니다. 이메일을 확인한 뒤 로그인해주세요.'
    );
  };

  return (
    <section className="min-h-[calc(100vh-8rem)] rounded-[2rem] bg-[#FFE8E8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-[#FF5F5E]/10 lg:min-h-[680px] lg:flex-row">
        <div className="flex flex-1 items-center justify-center p-8 sm:p-10 lg:p-12">
          <div className="relative flex h-full min-h-[360px] w-full items-center justify-center rounded-2xl bg-gray-100 p-8">
            <div className="absolute inset-4 rounded-2xl border border-white/80" />
            <div className="relative grid w-full max-w-sm place-items-center">
              <div className="absolute left-8 top-10 h-28 w-20 rounded-2xl bg-[#67B7FF]" />
              <div className="absolute right-5 top-24 h-24 w-28 rounded-2xl bg-cyan-300" />
              <div className="absolute right-20 top-4 h-20 w-24 rounded-2xl bg-indigo-100" />

              {/* Placeholder illustration area prepared for a future asset swap. */}
              <div className="relative flex h-72 w-52 items-end justify-center">
                <div className="absolute bottom-0 left-4 h-44 w-20 rounded-t-full bg-indigo-600" />
                <div className="absolute bottom-0 right-8 h-36 w-16 rounded-t-full bg-blue-500" />
                <div className="absolute bottom-36 left-10 h-28 w-28 rounded-[3rem] bg-sky-100" />
                <div className="absolute bottom-56 left-20 h-16 w-16 rounded-full bg-violet-800" />
                <div className="absolute bottom-40 right-0 h-40 w-24 rounded-2xl bg-[#4AAAF5] shadow-lg" />
                <div className="absolute bottom-48 right-10 h-16 w-32 rounded-xl bg-indigo-800 shadow-lg" />
                <div className="absolute bottom-12 h-5 w-48 rounded-full bg-blue-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center p-6 sm:p-10 lg:p-14">
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div>
              <h1 className="text-4xl font-extrabold tracking-normal text-slate-900">회원가입</h1>
            </div>

            <div className="space-y-4">
              <InputGroup
                icon={UserRoundPlus}
                name="firstName"
                placeholder="이름을 입력하세요"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <InputGroup
                icon={Users}
                name="lastName"
                placeholder="성을 입력하세요"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              <InputGroup
                icon={User}
                name="username"
                placeholder="사용자 이름을 입력하세요"
                value={formData.username}
                onChange={handleInputChange}
              />
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
              <InputGroup
                icon={AtSign}
                name="confirmPassword"
                type="password"
                placeholder="비밀번호를 한 번 더 입력하세요"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>

            <label className="flex w-fit items-center gap-3 text-sm font-medium text-slate-800">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(event) => setAgreedToTerms(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#FF5F5E] focus:ring-[#FF5F5E]"
              />
              <span>이용약관에 동의합니다</span>
            </label>

            {message && (
              <p
                className={`text-sm font-semibold ${
                  message.includes('완료') ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#FF8585] px-9 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#FF5F5E] focus:outline-none focus:ring-4 focus:ring-[#FF5F5E]/25"
            >
              {isSubmitting ? '가입 처리 중...' : '가입하기'}
            </button>

            <p className="text-sm font-medium text-slate-800">
              이미 계정이 있나요?{' '}
              <button
                type="button"
                onClick={onOpenSignIn}
                className="font-semibold text-[#008FE8] hover:text-[#006EB8]"
              >
                로그인
              </button>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
