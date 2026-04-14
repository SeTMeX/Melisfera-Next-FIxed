import Link from "next/link";
import HomePage from "@/app/page";
import { ProducePage } from "@/app/produse/ProducePage";
import { AboutUsPage } from "@/app/despre-noi/AboutUsPage";
import { GaleriePage } from "@/app/galerie/GaleriePage";
import { ContactPage } from "@/app/contact/ContactPage";
import ProfilPage from "@/app/profil/ProfilPage";
import TermeniPage from "@/app/termeni/TermeniPage";
import ConfidentialitatePage from "@/app/confidentialitate/ConfidentialitatePage";

export default function AppRouter() {
  return (
    <div>
      <nav>
        <Link href="/">Home</Link> | 
        <Link href="/produse">Produse</Link> | 
        <Link href="/despre">Despre</Link> | 
        <Link href="/galerie">Galerie</Link> | 
        <Link href="/contact">Contact</Link> | 
        <Link href="/profil">Profil</Link> | 
        <Link href="/termeni">Termeni</Link> | 
        <Link href="/confidentialitate">Confidentialitate</Link>
      </nav>
    </div>
  );
}