import "./globals.css";
import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Domifai",
  description: "AI powered domain generator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QDXQK0REKG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-QDXQK0REKG');`}
        </Script>
      </head>
      <body className={`${inter.variable} ${urbanist.variable} app-body`}>
        {children}
        <Analytics />
        <SpeedInsights />
        <div
          dangerouslySetInnerHTML={{
            __html: `<!-- Begin TradeTracker SuperTag Code -->
<script type="text/javascript">
    var _TradeTrackerTagOptions = {
        t: 'a',
        s: '503919',
        chk: 'a618d355af68a59e392db594efcf1315',
        overrideOptions: {}
    };

    (function() {
        var tt = document.createElement('script'),
            s = document.getElementsByTagName('script')[0];
        tt.setAttribute('type', 'text/javascript');
        tt.setAttribute(
            'src',
            (document.location.protocol == 'https:' ? 'https' : 'http') +
            '://tm.tradetracker.net/tag?t=' +
            _TradeTrackerTagOptions.t +
            '&s=' +
            _TradeTrackerTagOptions.s +
            '&chk=' +
            _TradeTrackerTagOptions.chk
        );
        s.parentNode.insertBefore(tt, s);
    })();
</script>
<!-- End TradeTracker SuperTag Code -->`,
          }}
        />
      </body>
    </html>
  );
}
