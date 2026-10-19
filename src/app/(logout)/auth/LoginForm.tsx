'use client';

import styles from '@/src/styles/pages/auth/login.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { CtaActionButton, FormInput, SectionTitle } from '@/src/components';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

export default function LoginForm() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // signIn を並行させると CSRF Cookie が複数発行されて検証に失敗するため、送信中は再送信させない
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { replace } = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage('');

    // react-doctor-disable-next-line react-doctor/url-prefilled-privileged-action -- callbackUrl は遷移先に使うだけ。NextAuth の既定の redirect コールバックが同一オリジン以外を baseUrl に置き換え、res.url もその検証済みの値になる
    const callbackUrl = new URL(window.location.href).searchParams.get('callbackUrl') ?? '/';

    try {
      const res = await signIn('credentials', {
        redirect: false,
        username: userId,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMessage('IDまたはパスワードが間違っています');
      } else if (res?.url && new URL(res.url).searchParams.get('csrf') === 'true') {
        // NextAuth は CSRF 検証の失敗を error なし・ok: true の signin?csrf=true で返す
        setErrorMessage('ログインに失敗しました。もう一度お試しください');
      } else if (res?.ok) {
        // 遷移が完了するまで再送信させないため、成功時は送信中のままにする
        replace(res.url ?? '/');
        return;
      }
    } catch {
      // ネットワークエラーや 5xx の HTML 応答で signIn が reject した場合
      setErrorMessage('ログインに失敗しました。もう一度お試しください');
    }
    setIsSubmitting(false);
  };

  return (
    <form className={clsx(styles.form, 'u-neumorphism')} onSubmit={handleSubmit}>
      <SectionTitle className={styles.title} title="ログイン" level={1}>
        <FontAwesomeIcon icon={faLock} />
      </SectionTitle>

      <label className={styles.label} htmlFor="login-id">
        <span>ID</span>
        <FormInput
          id="login-id"
          name="login-id"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
      </label>

      <label className={styles.label} htmlFor="login-pw">
        <span>パスワード</span>
        <FormInput
          id="login-pw"
          name="login-pw"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      <CtaActionButton type="submit" disabled={isSubmitting}>
        ログイン
      </CtaActionButton>
    </form>
  );
}
