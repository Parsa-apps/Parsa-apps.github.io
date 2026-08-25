import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden pt-20">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-neon-violet/20 blur-[120px]" />

      <Reveal className="relative text-center">
        <motion.img
          src="/assets/brand/parsa-main-crown.svg"
          alt=""
          width={120}
          height={57}
          className="mx-auto mb-4 animate-float"
        />
        <h1 className="text-[7rem] font-black leading-none text-gradient sm:text-[10rem]">404</h1>
        <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">اوه! این صفحه پیدا نشد</h2>
        <p className="mx-auto mt-4 max-w-md leading-8 text-white/60">
          به نظر می‌رسد این مسیر در دنیای پارسا اپس وجود ندارد. اما نگران نباشید، ما شما را به خانه برمی‌گردانیم.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/" className="btn btn-primary">بازگشت به صفحه اصلی</Link>
          <Link to="/store" className="btn btn-ghost">مشاهده محصولات</Link>
        </div>
      </Reveal>
    </div>
  );
}
