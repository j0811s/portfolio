import {
  container, copyright
} from "./index.css"
import Link from "next/link";
import Image from 'next/image';

export const Footer = () => {

  return (
    <footer className={container}>
      <small className={copyright}>&copy; 2023 J.Sato Portfolio</small>
    </footer>
  )
}