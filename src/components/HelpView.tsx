import React from 'react';
import { HelpCircle, CheckCircle, Smartphone, MousePointer, ShieldCheck } from 'lucide-react';

export const HelpView: React.FC = () => {
  const faqs = [
    {
      question: 'How do I mark a task as completed?',
      answer: "Click on the circular radio indicator on the left side of any task card. Clicking it cycles through 'Not Started', 'In Progress', and 'Completed'.",
    },
    {
      question: 'How do I flag a task as Vital?',
      answer: "Click the three horizontal dots menu on any task card and select 'Mark as Vital', or check the 'Mark as Vital Task' box when creating or editing a task.",
    },
    {
      question: 'How do I toggle between Desktop Mockup and Fullscreen View?',
      answer: "Click the 'Desk View / Clean View' button in the top right header bar to toggle the realistic workspace backdrop.",
    },
    {
      question: 'How do I invite team members?',
      answer: "Click the '+ Invite' pill button next to the avatar stack under the greeting header to send team invitations.",
    },
  ];

  return (
    <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Help & Guidance</h2>
          <p className="text-xs text-slate-500">Learn how to use your Task Dashboard effectively.</p>
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
