// src/app/page.tsx
import { redirect } from "next/navigation";
import { DEFAULT_LANG } from "../config/i18n";

export default function RootPage() {
  redirect(`/${DEFAULT_LANG}`);
}
