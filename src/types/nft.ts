export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  mint: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  properties: {
    files: Array<{
      uri: string;
      type: string;
    }>;
  };
}