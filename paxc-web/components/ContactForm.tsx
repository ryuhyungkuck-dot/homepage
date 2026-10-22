'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitInquiry, type InquiryState } from '@/app/actions';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-pink" disabled={pending}>
      {pending ? '보내는 중…' : '보내기 ▶'}
    </button>
  );
}

export function ContactForm() {
  const [state, action] = useFormState<InquiryState, FormData>(submitInquiry, null);
  return (
    <form action={action} className="win contact-win">
      <div className="win-bar bar-pink">
        <span>CONTACT.EXE</span>
        <span aria-hidden="true">_ □ ×</span>
      </div>
      <div className="win-body form-stack">
        <fieldset className="fieldset">
          <legend>문의 구분</legend>
          <div className="radio-row">
            {['Foodly 도입', '스마트공장 · 스마트해썹', '식품 장비 공급사 협업'].map((k, i) => (
              <label key={k} className="radio">
                <input type="radio" name="kind" value={k} defaultChecked={i === 0} /> {k}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid-2">
          <label className="field">
            회사명
            <input name="company" type="text" required maxLength={100} autoComplete="organization" />
          </label>
          <label className="field">
            연락처
            <input name="phone" type="tel" required maxLength={40} autoComplete="tel" />
          </label>
        </div>
        <label className="field">
          문의 내용
          <textarea name="message" rows={4} required maxLength={4000} />
        </label>
        <label className="hp" aria-hidden="true">
          웹사이트
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
        <div className="form-foot">
          <Submit />
          {state ? (
            <p role="status" className={state.ok ? 'msg-ok' : 'msg-err'}>
              {state.ok ? '✓ ' : '⚠ '}
              {state.message}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
