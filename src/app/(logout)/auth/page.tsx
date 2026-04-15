'use client';

import styles from '@/src/styles/pages/auth/login.module.css';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { CtaActionButton, FormInput, SectionTitle } from '@/src/components';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const callbackUrl = searchParams.get('callbackUrl') ?? '/';

    const res = await signIn('credentials', {
      redirect: false,
      username: userId,
      password,
      callbackUrl,
    });

    if (res?.error) {
      setErrorMessage('IDまたはパスワードが間違っています');
    } else if (res?.ok) {
      router.replace(res.url ?? '/');
    }
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

      <CtaActionButton type="submit">ログイン</CtaActionButton>
    </form>
  );
}
