import { permanentRedirect } from "next/navigation";

export default function TermsOfServiceRedirectPage() {
  permanentRedirect("/terms");
}
