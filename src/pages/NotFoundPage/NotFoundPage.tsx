import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandMark } from "../../components/common/BrandMark";

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-6 py-12">
      <section className="w-full max-w-lg rounded-xl border border-line bg-white p-8 text-center sm:p-10">
        <BrandMark className="justify-center" />
        <p className="mt-8 text-xs font-semibold tracking-[0.14em] text-brand-700 uppercase">404</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink-950">页面不存在</h1>
        <p className="mt-3 text-sm leading-6 text-ink-500">
          当前链接可能已失效，或者页面尚未进入 V1 第一版建设范围。
        </p>
        <Link
          to="/app"
          className="mt-7 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          返回工作台
        </Link>
      </section>
    </main>
  );
}
