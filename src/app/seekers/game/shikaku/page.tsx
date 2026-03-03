import GameEmbed from "../game-embed";

export const metadata = {
  title: "shikaku | attn:seeker",
  description: "daily shikaku puzzle. divide the grid into rectangles.",
};

export default function ShikakuPage() {
  return <GameEmbed game="shikaku" />;
}
