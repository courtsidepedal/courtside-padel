import affiliates from './affiliates.json';

export function getAffiliateUrl(retailerId: string, productPath: string): string {
  const retailer = affiliates.retailers.find((r) => r.id === retailerId);

  if (!retailer) {
    console.warn(
      `[affiliateLink] Unknown retailer id "${retailerId}". Check src/data/affiliates.json.`
    );
    return '#';
  }

  const path = productPath.startsWith('/') ? productPath : `/${productPath}`;
  return `${retailer.baseUrl}${path}${retailer.affiliateQuery}`;
}

export function getRetailerName(retailerId: string): string {
  const retailer = affiliates.retailers.find((r) => r.id === retailerId);
  return retailer?.name ?? 'retailer';
}
