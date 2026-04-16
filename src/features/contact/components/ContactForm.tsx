'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { CtaActionButton, FormInput } from '@/src/components';
import styles from '@/src/features/contact/styles/ContactForm.module.css';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={clsx(styles.result, 'u-neumorphism')}>
        <p className={styles.successMessage}>送信しました。お返事をお待ちください。</p>
      </div>
    );
  }

  return (
    <form
      className={clsx(styles.form, 'u-neumorphism')}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <label className={styles.label} htmlFor="contact-name">
        <span className={styles.labelText}>お名前</span>
        <FormInput
          id="contact-name"
          type="text"
          placeholder="山田 太郎"
          aria-invalid={!!errors.name}
          {...register('name', { required: 'お名前は必須です' })}
        />
        {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
      </label>

      <label className={styles.label} htmlFor="contact-email">
        <span className={styles.labelText}>メールアドレス</span>
        <FormInput
          id="contact-email"
          type="email"
          placeholder="example@email.com"
          aria-invalid={!!errors.email}
          {...register('email', {
            required: 'メールアドレスは必須です',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: '正しいメールアドレスを入力してください',
            },
          })}
        />
        {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
      </label>

      <label className={styles.label} htmlFor="contact-subject">
        <span className={styles.labelText}>件名</span>
        <FormInput
          id="contact-subject"
          type="text"
          placeholder="件名を入力してください"
          aria-invalid={!!errors.subject}
          {...register('subject', { required: '件名は必須です' })}
        />
        {errors.subject && <span className={styles.errorText}>{errors.subject.message}</span>}
      </label>

      <label className={styles.label} htmlFor="contact-message">
        <span className={styles.labelText}>メッセージ</span>
        <textarea
          id="contact-message"
          className={styles.textarea}
          placeholder="お問い合わせ内容をご入力ください"
          rows={6}
          aria-invalid={!!errors.message}
          {...register('message', {
            required: 'メッセージは必須です',
            maxLength: { value: 2000, message: '2000文字以内で入力してください' },
          })}
        />
        {errors.message && <span className={styles.errorText}>{errors.message.message}</span>}
      </label>

      {status === 'error' && (
        <p className={styles.errorText}>送信に失敗しました。時間をおいて再度お試しください。</p>
      )}

      <div className={styles.submit}>
        <CtaActionButton type="submit" disabled={status === 'loading'} nextIcon>
          {status === 'loading' ? '送信中...' : '送信する'}
        </CtaActionButton>
      </div>
    </form>
  );
}
