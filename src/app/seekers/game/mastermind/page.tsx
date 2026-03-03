import GameEmbed from "../game-embed";

export const metadata = {
  title: "mastermind | attn:seeker",
  description: "daily mastermind puzzle. crack the colour code.",
};

export default function MastermindPage() {
  return <GameEmbed game="mastermind" />;
}
