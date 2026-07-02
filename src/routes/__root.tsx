import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { useStore } from "@/lib/store";

function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background px-6 text-center">
      <div>
        <div className="text-6xl">🧭</div>
        <h1 className="mt-3 text-2xl font-bold">الصفحة غير موجودة</h1>
        <p className="mt-2 text-sm text-muted-foreground">جرّب الرجوع للرئيسية.</p>
        <a href="/home" className="mt-6 inline-flex rounded-2xl bg-primary px-5 py-3 text-primary-foreground">الرئيسية</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "root" }); }, [error]);
  return (
    <div className="grid min-h-dvh place-items-center bg-background px-6 text-center">
      <div>
        <div className="text-5xl">⚠️</div>
        <h1 className="mt-3 text-xl font-bold">حدث خطأ غير متوقع</h1>
        <p className="mt-2 text-sm text-muted-foreground">حاول إعادة المحاولة.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-2xl bg-primary px-5 py-3 text-primary-foreground"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "منيع — كوتش مالي ذكي" },
      { name: "description", content: "منيع تطبيق ذكاء اصطناعي يحميك من الإرهاق المالي عبر تحليل سلوكك وتقديم توصيات مخصّصة." },
      { name: "theme-color", content: "#4F46E5" },
      { property: "og:title", content: "منيع — كوتش مالي ذكي" },
      { property: "og:description", content: "احمِ نفسك من الإرهاق المالي قبل حدوثه." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const dark = useStore((s) => s.darkMode);
  const recovery = useStore((s) => s.recoveryMode);
  const fontScale = useStore((s) => s.fontScale);
  const colorblind = useStore((s) => s.colorblind);
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", dark);
    html.classList.toggle("recovery", recovery);
    html.classList.toggle("cb", colorblind);
    html.style.fontSize = `${16 * fontScale}px`;
  }, [dark, recovery, fontScale, colorblind]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto min-h-dvh max-w-md bg-background text-foreground">
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}
