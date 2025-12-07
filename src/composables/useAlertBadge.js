import { useState } from "#imports";

export const useAlertBadge = () => {
  const badgeCount = useState("badgeCount", () => 0);

  const increase = (num = 1) => {
    badgeCount.value += num;
  };

  const reset = () => {
    badgeCount.value = 0;
  };

  return { badgeCount, increase, reset };
};
