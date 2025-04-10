
import { ProviderComparison, ServiceCategory, ServiceProvider } from "@/types";
import { serviceCategoryLabels } from "@/mocks/data";
import { toast } from "sonner";

export function startProviderComparison(
  setComparison: React.Dispatch<React.SetStateAction<ProviderComparison | null>>,
  category: ServiceCategory
) {
  setComparison({
    category,
    providers: []
  });
  toast.info(`Started comparing ${serviceCategoryLabels[category]} providers`);
}

export function addProviderToComparison(
  comparison: ProviderComparison | null,
  setComparison: React.Dispatch<React.SetStateAction<ProviderComparison | null>>,
  getProvider: (id: string) => ServiceProvider | undefined,
  providerId: string
) {
  if (!comparison) return;
  
  const provider = getProvider(providerId);
  if (!provider) return;
  
  // Only add if not already in the comparison and matches the category
  if (
    provider.category === comparison.category &&
    !comparison.providers.some(p => p.id === providerId)
  ) {
    setComparison({
      ...comparison,
      providers: [...comparison.providers, provider]
    });
    toast.success(`Added ${provider.name} to comparison`);
  }
}

export function removeProviderFromComparison(
  comparison: ProviderComparison | null,
  setComparison: React.Dispatch<React.SetStateAction<ProviderComparison | null>>,
  providerId: string
) {
  if (!comparison) return;
  
  setComparison({
    ...comparison,
    providers: comparison.providers.filter(p => p.id !== providerId)
  });
}

export function clearProviderComparison(
  setComparison: React.Dispatch<React.SetStateAction<ProviderComparison | null>>
) {
  setComparison(null);
}
