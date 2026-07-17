import { HeritageGame } from "@/components/heritage-game";

export default function Home() {
  const mockVoice = process.env.MOCK_VOICE_API !== "false" || !process.env.OPENAI_API_KEY;
  return <HeritageGame voiceApiMode={mockVoice ? "mock" : "live"} />;
}
