import Link from "next/link";
import { GITHUB_URL } from "@/src/constants/url";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";

export function GithubLink() {
  return (
    <Link href={GITHUB_URL} target="_blank" rel="noreferrer">
      <FontAwesomeIcon icon={faCodeBranch} />
      <span>GitHub</span>
    </Link>
  )
}