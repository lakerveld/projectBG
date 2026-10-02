import { Wheat, TestTube, Snowflake } from "lucide-react";
import {
  rewardResources,
  type JourneyInventory,
  type RewardResource
} from "@/lib/domain/journeyRewards";
import styles from "./ResourceReveal.module.css";

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
            className={`${styles.slot} ${name === resource ? styles.active : ""}`}
          >
            {name === resource && (
              <span className={styles.delta} aria-hidden="true">
                {delta}
              </span>
            )}
            <Icon size={20} aria-hidden="true" />
            <strong>{inventory[name]}</strong>
            <span>{name}</span>
          </li>
        );
      })}
    </ul>
  );
}
