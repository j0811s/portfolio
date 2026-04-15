import styles from '@/src/components/styles/ui/FormInput.module.css';
import clsx from 'clsx';
import type { ComponentProps } from 'react';

type Props = ComponentProps<'input'> & {};

function FormInput(props: Props) {
  return <input {...props} className={clsx(styles.input, props.className ?? '')} />;
}

export default FormInput;
