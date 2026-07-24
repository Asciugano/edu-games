import { CardContent } from "@/components/ui/card";

import { Switch } from "@/components/ui/switch";

import { Slider } from "@/components/ui/slider";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LearningSection() {
  return (
    <CardContent className="space-y-8">
      <div className="space-y-6">
        <div>
          <p className="mb-2 font-medium">Default difficulty</p>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Normal" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>

              <SelectItem value="normal">Normal</SelectItem>

              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="mb-3 font-medium">Daily Goal</p>

          <Slider defaultValue={[20]} max={60} />

          <p className="mt-2 text-sm text-muted-foreground">20 minutes/day</p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="font-medium">Show Hints</p>

            <p className="text-sm text-muted-foreground">
              Display suggestions during games.
            </p>
          </div>

          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="font-medium">Background Music</p>

            <p className="text-sm text-muted-foreground">
              Play relaxing music.
            </p>
          </div>

          <Switch />
        </div>
      </div>
    </CardContent>
  );
}
