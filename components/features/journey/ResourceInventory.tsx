import { Wheat, TestTube, Snowflake } from "lucide-react";
import {
  rewardResources,
  type JourneyInventory,
  type RewardResource
} from "@/lib/domain/journeyRewards";
import styles from "./ResourceReveal.module.css";
import { resourceColors } from "@/lib/ui/resourceColors";

const icons = { Gerst: Wheat, Salmari: TestTube, Sneeuw: Snowflake };

export function ResourceInventory({
  inventory,
  resource,
  delta
}: {
  inventory: JourneyInventory;
  resource: RewardResource | null;
  delta: "+1" | "−1";
}) {
  return (
    <ul aria-label="Nieuwe voorraad" className={styles.inventory}>
      {rewardResources.map((name) => {
        const Icon = icons[name];
        return (
          <li
            key={name}
            aria-label={`${name}: ${inventory[name]}${name === resource ? ` (${delta})` : ""}`}
            className={styles.slot}
          >
            <div
              className={`${styles.pill} ${name === resource ? styles.active : ""}`}
              style={{ backgroundColor: resourceColors[name] }}
            >
              {name === resource && (
                <span className={styles.delta} aria-hidden="true">
                  {delta}
                </span>
              )}
              <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
              <strong>{inventory[name]}</strong>
            </div>
            <span>{name}</span>
          </li>
        );
      })}
    </ul>
  );
}
