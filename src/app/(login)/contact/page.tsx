import type { Metadata } from 'next';
import { SectionTitle } from '@/src/components';
import { ContactForm } from '@/src/features/contact';
import { metadata as rootMetadata } from '@/src/app/layout';

export const metadata: Metadata = {
  ...rootMetadata,
  title: 'お問い合わせ',
  description: 'お問い合わせページです。',
};

export default function ContactPage() {
  return (
    <section>
      <SectionTitle title="お問い合わせ" level={1} />
      <ContactForm />
    </section>
  );
}
