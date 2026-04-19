import type { Topic, UpcomingTopic } from "@/lib/types";
import { eucharist } from "./eucharist";

export const topics: Topic[] = [eucharist];

export const upcomingTopics: UpcomingTopic[] = [
  {
    slug: "mary",
    title: "Mary",
    subtitle:
      "Mother of God, ever-virgin, assumed into heaven — why the Church honors her.",
    comingSoon: true,
  },
  {
    slug: "confession",
    title: "Confession",
    subtitle:
      "Why a priest? Scripture, the early Church, and the forgiveness Christ gave His apostles.",
    comingSoon: true,
  },
  {
    slug: "papacy",
    title: "The Papacy",
    titleEmphasis: "Papacy",
    subtitle:
      "Peter, the keys, and an unbroken line of successors from the first century.",
    comingSoon: true,
  },
  {
    slug: "sola-scriptura",
    title: "Sola Scriptura",
    titleEmphasis: "Sola Scriptura",
    subtitle:
      "Where the Bible came from, and why the canon itself presupposes the Church.",
    comingSoon: true,
  },
  {
    slug: "the-mass",
    title: "The Mass",
    titleEmphasis: "Mass",
    subtitle:
      "Not invented in Rome — the liturgy echoed by Justin Martyr in AD 155 is still ours.",
    comingSoon: true,
  },
  {
    slug: "saints",
    title: "The Saints",
    titleEmphasis: "Saints",
    subtitle:
      "The great cloud of witnesses — why the Church asks them to pray with us.",
    comingSoon: true,
  },
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}
