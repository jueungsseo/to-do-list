import React from 'react';
import { HelpCircle, CheckCircle, Smartphone, MousePointer, ShieldCheck } from 'lucide-react';

export const HelpView: React.FC = () => {
  const faqs = [
    {
      question: '할 일을 완료로 바꾸려면 어떻게 하나요?',
      answer: "할 일 카드 왼쪽의 동그란 상태 버튼을 누르면 '시작 전', '진행 중', '완료' 순서로 바뀝니다.",
    },
    {
      question: '중요 할 일은 어떻게 표시하나요?',
      answer: "카드의 점 세 개 메뉴에서 '중요 표시'를 선택하거나, 할 일을 만들 때 '중요 할 일로 표시'를 체크하면 됩니다.",
    },
    {
      question: '배경 보기는 어떻게 바꾸나요?',
      answer: "오른쪽 상단의 '배경 보기 / 깔끔한 보기' 버튼을 누르면 화면 배경을 전환할 수 있습니다.",
    },
    {
      question: '팀원은 어떻게 초대하나요?',
      answer: "인사말 오른쪽의 '+ 초대' 버튼을 누르면 팀원 초대 창이 열립니다.",
    },
  ];

  return (
    <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">도움말</h2>
          <p className="text-xs text-slate-500">투두리스트를 더 편하게 쓰는 방법을 확인하세요.</p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-1.5"
          >
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#FF5F5E]" />
              <span>{faq.question}</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
