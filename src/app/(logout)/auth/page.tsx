import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'ログイン',
  robots: 'noindex, nofollow',
};

export default function Login() {
  return <LoginForm />;
}
