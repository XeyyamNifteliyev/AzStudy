export function annualTotalCost(
  tuitionUSD: number,
  monthlyLivingCostUSD?: number,
): number {
  return monthlyLivingCostUSD != null
    ? tuitionUSD + monthlyLivingCostUSD * 12
    : tuitionUSD;
}
