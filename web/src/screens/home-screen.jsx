/* B. 今天，我想… — 目前隱藏，保留架構位置（流程 A→B→C），日後產品成熟時再啟用。 */
import { BreathingVisual } from "../components/breathing-visual";
import { Button } from "../components/ui/button";
import { Chip } from "../components/ui/chip";
import { Eyebrow } from "../components/ui/eyebrow";
import { Textarea } from "../components/ui/input";
import { Icon } from "../components/icon";
import { GIFT_DATA } from "../data/gift";
import { Screen } from "./screen-shell";

export function HomeScreen({ intention, setIntention, onNext }) {
  return (
    <Screen label="B 首頁" className="relative">
      <div className="pointer-events-none absolute -right-6 -top-2 z-0 h-44 w-44 opacity-90">
        <BreathingVisual variant="stars" size={120} />
      </div>

      <div className="relative z-10 pt-6">
        <h1 className="font-serif text-[34px] leading-tight text-foreground">
          今天，我想…
        </h1>
      </div>

      <div className="relative z-10 mt-6">
        <Textarea
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder="寫下今天想為自己做的一件事"
          rows={2}
        />
      </div>

      <div className="relative z-10 mt-7 flex-1">
        <Eyebrow className="mb-4">靈感庫</Eyebrow>
        <div className="flex flex-wrap gap-2.5">
          {GIFT_DATA.ideas.map((idea) => (
            <Chip
              key={idea}
              active={intention === idea}
              onClick={() => setIntention(idea)}
            >
              {idea}
            </Chip>
          ))}
        </div>
      </div>

      <div className="relative z-10 pt-4">
        <Button
          size="lg"
          className="w-full"
          disabled={!intention.trim()}
          onClick={onNext}
        >
          我準備好了
          <Icon name="arrowRight" size={18} />
        </Button>
      </div>
    </Screen>
  );
}
