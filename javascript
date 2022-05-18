const address = "0x8Cf61fBAa744f65c5Ac9fbdf4FD39cEC3049460d"; // address of the wallet you want to claim the NFTs
const quantity = 1; // how many unique NFTs you want to claim

const tx = await contract.claimTo(address, quantity);
const receipt = tx.receipt; // the transaction receipt
const claimedTokenId = tx.id; // the id of the NFT claimed
const claimedNFT = await tx.data(); // (optional) get the claimed NFT metadata

// Custom metadata of the NFTs to create
const metadatas = [{
  name: "Cool NFT",
  description: "This is a cool NFT",
  image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
}, {
  name: "Cool NFT",
  description: "This is a cool NFT",
  image: fs.readFileSync("path/to/image.png"),
}];

const results = await contract.createBatch(metadatas); // uploads and creates the NFTs on chain
const firstTokenId = results[0].id; // token id of the first created NFT
const firstNFT = await results[0].data(); // (optional) fetch details of the first created NFT
const unclaimedNFTCount = await contract.totalUnclaimedSupply();
// Minting NFTs
const nfts = await contract.getAll();
console.log(nfts);

//claimed supply
const claimedNFTCount = await contract.totalClaimedSupply();
console.log(`NFTs claimed so far: ${claimedNFTCount}`);

//unclaimed supply
console.log(`NFTs left to claim: ${unclaimedNFTCount}`);

//GET NFT balance
const walletAddress = "0x8Cf61fBAa744f65c5Ac9fbdf4FD39cEC3049460d";
const balance = await contract.nft.balanceOf(walletAddress);
console.log(balance);

//Get single NFT
const tokenId = 0;
const nft = await contract.nft.get(tokenId);

// Transfer single NFTs
const walletAddress = "0x8Cf61fBAa744f65c5Ac9fbdf4FD39cEC3049460d";
const tokenId = 0;
await contract.nft.transfer(walletAddress, tokenId);

//Configure claim conditions
const presaleStartTime = new Date();
const publicSaleStartTime = new Date(Date.now() + 60 * 60 * 24 * 1000);
const claimConditions = [
  {
    startTime: presaleStartTime, // start the presale now
    maxQuantity: 2, // limit how many mints for this presale
    price: 0.01, // presale price
    snapshot: ['0x...', '0x...'], // limit minting to only certain addresses
  },
  {
    startTime: publicSaleStartTime, // 24h after presale, start public sale
    price: 0.08, // public sale price
  }
]);
await contract.claimConditions.set(claimConditions);

//Delayed reveal
// the real NFTs, these will be encrypted until you reveal them
const realNFTs = [{
  name: "Common NFT #1",
  description: "Common NFT, one of many.",
  image: fs.readFileSync("path/to/image.png"),
}, {
  name: "Super Rare NFT #2",
  description: "You got a Super Rare NFT!",
  image: fs.readFileSync("path/to/image.png"),
}];
// A placeholder NFT that people will get immediately in their wallet, and will be converted to the real NFT at reveal time
const placeholderNFT = {
  name: "Hidden NFT",
  description: "Will be revealed next week!"
};
// Create and encrypt the NFTs
await contract.revealer.createDelayedRevealBatch(
  placeholderNFT,
  realNFTs,
  "my secret password",
);
// Whenever you're ready, reveal your NFTs at any time
const batchId = 0; // the batch to reveal
await contract.revealer.reveal(batchId, "my secret password");

//Configure royalties
// royalties on the whole contract
contract.royalty.setDefaultRoyaltyInfo({
  seller_fee_basis_points: 100, // 1%
  fee_recipient: "0x..."
});
// override royalty for a particular token
contract.royalty.setTokenRoyaltyInfo(tokenId, {
  seller_fee_basis_points: 500, // 5%
  fee_recipient: "0x..."
});
