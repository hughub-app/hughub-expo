import { Child, listChildren } from "@/lib/api/endpoints/children";
import { useEffect, useState } from "react";

interface UseGetChildProps {
  childId: string;
}

export function useGetChild({ childId }: UseGetChildProps) {
  const [child, setChild] = useState<Child | null>(null);

  useEffect(() => {
    if (!childId) {
      setChild(null);
    }
    listChildren({ ids: childId }).then((data) => {
      setChild(data?.[0] || null);
    });
  }, [childId]);

  return child;
}
