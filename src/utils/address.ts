/**
 * Shortens a blockchain address to a more readable format
 * @param address The full address to shorten
 * @param startLength Number of characters to keep at the start (default: 4)
 * @param endLength Number of characters to keep at the end (default: 4)
 * @returns The shortened address with ellipsis
 */
export const shortenAddress = (
  address: string,
  startLength: number = 4,
  endLength: number = 4
): string => {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  
  const start = address.slice(0, startLength);
  const end = address.slice(-endLength);
  
  return `${start}...${end}`;
};
