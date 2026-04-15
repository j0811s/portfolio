import Link from 'next/link';
import { GITHUB_URL } from '@/src/constants/url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

export function GithubLink() {
  return (
    <Link href={GITHUB_URL} target="_blank" rel="noreferrer">
      <FontAwesomeIcon icon={faGithub as IconProp} />
      <span>GitHub</span>
    </Link>
  );
}
