import React from "react";
import Navbar from "../components/navbar";
import Footer from "./../components/footer";
import GlassSurface from "../components/ui/GlassSurface/GlassSurface";
import "./../index.css";

export default function IrcPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-black text-white">
      <Navbar />

      {}
      <section className="relative w-full px-6 pt-28 pb-10 text-center">
        <span className="inline-block rounded-full border border-[#00ffff]/40 bg-[#00ffff]/10 px-4 py-1 text-xs uppercase tracking-widest text-[#00ffff]">
          Live Community Chat
        </span>
        <h1 className="mt-6 font-black tracking-tight text-4xl md:text-6xl">
          <span className="text-[#00ffff]">VOID</span> IRC
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/80 md:text-lg">
          Our community lives on Libera.Chat. Connect, collaborate, and share your
          passion for cybersecurity with like-minded people — right from your browser.
        </p>
      </section>

      {}
      <section className="mx-auto w-full max-w-6xl px-4 pb-10">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 shadow-2xl backdrop-blur-xl">
          <iframe
            src="https://web.libera.chat/#void-society"
            title="VOID IRC Chat"
            className="h-[72vh] min-h-[480px] w-full rounded-xl border-none"
          />
        </div>
      </section>

      {}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24">
        <GlassSurface
          width="100%"
          height={150}
          borderRadius={22}
          borderWidth={0.05}
          brightness={50}
          opacity={0.9}
          blur={12}
          backgroundOpacity={0.12}
          saturation={1.2}
        >
          <div className="grid w-full grid-cols-1 gap-6 px-6 text-center sm:grid-cols-3">
            <div>
              <p className="text-[0.7rem] uppercase tracking-widest text-white/50">Server</p>
              <p className="mt-1 font-semibold text-[#00ffff]">irc.libera.chat</p>
            </div>
            <div>
              <p className="text-[0.7rem] uppercase tracking-widest text-white/50">Port</p>
              <p className="mt-1 font-semibold text-[#00ffff]">6697 (TLS)</p>
            </div>
            <div>
              <p className="text-[0.7rem] uppercase tracking-widest text-white/50">Channel</p>
              <p className="mt-1 font-semibold text-[#00ffff]">#void-society</p>
            </div>
          </div>
        </GlassSurface>
      </section>

      <Footer />
    </div>
  );
}
