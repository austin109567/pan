import axios from 'axios';
import { NFTMetadata } from '../types/nft';
import { Cache } from './cache';

// Load RPC settings from localStorage or use default
const getRPCSettings = () => {
  const customRpcUrl = localStorage.getItem('custom_rpc_url');
  const customApiKey = localStorage.getItem('custom_api_key');
  
  if (customRpcUrl && customApiKey) {
    return {
      url: customRpcUrl,
      apiKey: customApiKey
    };
  }
  
  return {
    url: 'https://mainnet.helius-rpc.com',
    apiKey: '294dd1b6-c58f-4fd1-bebf-2b17a910915a'
  };
};

const COLLECTION_ADDRESS = 'Hcudg3n6ggbc5kMo2ZtVbXKJb7oXhNCQxJsY42ZMiPpp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

const cache = Cache.getInstance();

const getRpcUrl = () => {
  const settings = getRPCSettings();
  return `${settings.url}/?api-key=${settings.apiKey}`;
};

export async function fetchCollectionNFTs(): Promise<NFTMetadata[]> {
  const cacheKey = 'collection_nfts';
  const cachedData = cache.get<NFTMetadata[]>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.post(getRpcUrl(), {
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAssetsByGroup',
      params: {
        groupKey: 'collection',
        groupValue: COLLECTION_ADDRESS,
        page: 1,
        limit: 50, // Reduced limit to minimize data transfer
        sortBy: {
          sortBy: 'created',
          sortDirection: 'desc'
        }
      },
    });

    if (response.data.error) {
      throw new Error(response.data.error.message);
    }

    const nfts = parseNFTResponse(response.data.result.items);
    cache.set(cacheKey, nfts, CACHE_DURATION);
    return nfts;
  } catch (error) {
    console.error('Error fetching collection NFTs:', error);
    return [];
  }
}

export async function fetchWalletNFTs(walletAddress: string): Promise<NFTMetadata[]> {
  const cacheKey = `wallet_nfts_${walletAddress}`;
  const cachedData = cache.get<NFTMetadata[]>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.post(getRpcUrl(), {
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAssetsByOwner',
      params: {
        ownerAddress: walletAddress,
        page: 1,
        limit: 25, // Reduced limit for wallet NFTs
        displayOptions: {
          showCollectionMetadata: true
        }
      },
    });

    if (response.data.error) {
      throw new Error(response.data.error.message);
    }

    const collectionNFTs = response.data.result.items.filter(
      (item: any) => item.grouping.find((g: any) => 
        g.group_key === 'collection' && 
        g.group_value === COLLECTION_ADDRESS
      )
    );

    const nfts = parseNFTResponse(collectionNFTs);
    cache.set(cacheKey, nfts, CACHE_DURATION);
    return nfts;
  } catch (error) {
    console.error('Error fetching wallet NFTs:', error);
    return [];
  }
}

function parseNFTResponse(items: any[]): NFTMetadata[] {
  return items.map((asset: any) => ({
    name: asset.content.metadata.name || 'Unnamed NFT',
    symbol: asset.content.metadata.symbol || '',
    description: asset.content.metadata.description || '',
    image: asset.content.files[0]?.uri || '',
    mint: asset.id,
    attributes: asset.content.metadata.attributes || [],
    properties: {
      files: (asset.content.files || []).map((file: any) => ({
        uri: file.uri || '',
        type: file.type || '',
      })),
    },
  }));
}