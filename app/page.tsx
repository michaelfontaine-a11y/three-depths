import TopicCard from "@/components/TopicCard";
import { topics, upcomingTopics } from "@/content/topics/_index";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="max-w-5xl mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-12 text-center">
        <div className="font-caps text-[0.78rem] tracking-[0.45em] text-ink-muted mb-6">
          · IN TRIBUS GRADIBUS ·
        </div>
        <h1 className="font-display text-[3.5rem] md:text-[5.5rem] leading-[1.02] text-ink mb-4">
          Three <span className="italic" style={{ color: "var(--gold-deep)" }}>Depths</span>
        </h1>
        <div
          className="mx-auto w-20 h-px my-6"
          style={{ background: "linear-gradient(to right, transparent, #8C6F2C, transparent)" }}
        />
        <p className="font-body text-[1.2rem] md:text-[1.35rem] leading-[1.6] text-ink-soft max-w-2xl mx-auto italic">
          The timeless truths of the Catholic faith — told at three depths, so
          the whole family can engage with the same truth at their own level.
        </p>
      </header>

      <section className="max-w-5xl mx-auto px-5 md:px-8 pb-24">
        <div className="text-center mb-10">
          <div className="font-caps text-[0.78rem] tracking-[0.32em] text-ink-muted mb-3">
            · THE LIBRARY ·
          </div>
          <h2 className="font-display text-[2rem] md:text-[2.5rem] text-ink">
            Choose a topic
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topics.map((t) => (
            <TopicCard
              key={t.slug}
              slug={t.slug}
              title={t.title}
              titleEmphasis={t.titleEmphasis}
              subtitle={t.subtitle}
              latinTag={t.latinTag}
              accent="#B8943D"
              accentDeep="#8C6F2C"
            />
          ))}
          {upcomingTopics.map((t) => (
            <TopicCard
              key={t.slug}
              slug={t.slug}
              title={t.title}
              titleEmphasis={t.titleEmphasis}
              subtitle={t.subtitle}
              disabled
            />
          ))}
        </div>
      </section>

      <footer className="max-w-5xl mx-auto px-5 md:px-8 pb-16 text-center">
        <div
          className="mx-auto w-16 h-px mb-6"
          style={{ background: "linear-gradient(to right, transparent, #8C6F2C, transparent)" }}
        />
        <p className="font-caps text-[0.72rem] tracking-[0.3em] text-ink-muted">
          ❦ · AD MAIOREM DEI GLORIAM · ❦
        </p>
      </footer>
    </div>
  );
}
