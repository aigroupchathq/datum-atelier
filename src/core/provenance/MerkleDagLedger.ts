import { sha256 } from '../crypto/sha256';

export interface MaintenanceEventBlock {
  blockIndex: number;
  vin: string;
  timestamp: string;
  eventType: 'VALVE_CLEARANCE' | 'ROD_BEARINGS' | 'DYNO_TUNE' | 'BRAKE_FLUID' | 'OIL_SERVICE' | 'ECU_FLASH';
  details: string;
  technicianPubKey: string;
  signatureEd25519: string;
  mileage: number;
  torqueSpecsNm?: number;
  dynoBhp?: number;
  prevBlockHash: string;
  leafHash?: string;
}

export interface MerkleNode {
  hash: string;
  left?: MerkleNode;
  right?: MerkleNode;
  data?: MaintenanceEventBlock;
}

export interface MerkleProofStep {
  position: 'left' | 'right';
  hash: string;
}

export class MerkleDagLedger {
  private blocks: MaintenanceEventBlock[] = [];
  private rootNode: MerkleNode | null = null;

  constructor(initialBlocks: MaintenanceEventBlock[] = []) {
    this.blocks = [...initialBlocks];
    this.rebuildTree();
  }

  public hashBlock(block: MaintenanceEventBlock): string {
    const rawPayload = JSON.stringify({
      index: block.blockIndex,
      vin: block.vin,
      timestamp: block.timestamp,
      type: block.eventType,
      details: block.details,
      tech: block.technicianPubKey,
      sig: block.signatureEd25519,
      mileage: block.mileage,
      torque: block.torqueSpecsNm || 0,
      bhp: block.dynoBhp || 0,
      prev: block.prevBlockHash
    });
    return '0x' + sha256(rawPayload);
  }

  public appendBlock(
    vin: string,
    eventType: MaintenanceEventBlock['eventType'],
    details: string,
    technicianPubKey: string,
    signatureEd25519: string,
    mileage: number,
    torqueSpecsNm?: number,
    dynoBhp?: number
  ): MaintenanceEventBlock {
    const prevBlock = this.blocks[this.blocks.length - 1];
    const prevHash = prevBlock ? (prevBlock.leafHash || this.hashBlock(prevBlock)) : '0x0000000000000000000000000000000000000000000000000000000000000000';

    const newBlock: MaintenanceEventBlock = {
      blockIndex: this.blocks.length,
      vin,
      timestamp: new Date().toISOString(),
      eventType,
      details,
      technicianPubKey,
      signatureEd25519,
      mileage,
      torqueSpecsNm,
      dynoBhp,
      prevBlockHash: prevHash
    };

    newBlock.leafHash = this.hashBlock(newBlock);
    this.blocks.push(newBlock);
    this.rebuildTree();
    return newBlock;
  }

  public rebuildTree(): void {
    if (this.blocks.length === 0) {
      this.rootNode = null;
      return;
    }

    let nodes: MerkleNode[] = this.blocks.map(block => {
      const hash = block.leafHash || this.hashBlock(block);
      block.leafHash = hash;
      return { hash, data: block };
    });

    while (nodes.length > 1) {
      const nextLevel: MerkleNode[] = [];
      for (let i = 0; i < nodes.length; i += 2) {
        const left = nodes[i];
        const right = i + 1 < nodes.length ? nodes[i + 1] : nodes[i]; // Duplicate last leaf if odd
        const parentHash = '0x' + sha256(left.hash + right.hash);
        nextLevel.push({
          hash: parentHash,
          left,
          right
        });
      }
      nodes = nextLevel;
    }

    this.rootNode = nodes[0] || null;
  }

  public getRootHash(): string {
    return this.rootNode ? this.rootNode.hash : '0x0000000000000000000000000000000000000000';
  }

  public getBlocks(): MaintenanceEventBlock[] {
    return [...this.blocks];
  }

  public generateProof(blockIndex: number): MerkleProofStep[] | null {
    if (blockIndex < 0 || blockIndex >= this.blocks.length || !this.rootNode) {
      return null;
    }

    const proof: MerkleProofStep[] = [];
    let currentLevel: string[] = this.blocks.map(b => b.leafHash || this.hashBlock(b));
    let index = blockIndex;

    while (currentLevel.length > 1) {
      const isRight = index % 2 === 1;
      const pairIndex = isRight ? index - 1 : (index + 1 < currentLevel.length ? index + 1 : index);
      
      proof.push({
        position: isRight ? 'left' : 'right',
        hash: currentLevel[pairIndex]
      });

      const nextLevel: string[] = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : currentLevel[i];
        nextLevel.push('0x' + sha256(left + right));
      }

      currentLevel = nextLevel;
      index = Math.floor(index / 2);
    }

    return proof;
  }

  public verifyProof(leafHash: string, proof: MerkleProofStep[], expectedRoot: string): boolean {
    let currentHash = leafHash;
    for (const step of proof) {
      if (step.position === 'left') {
        currentHash = '0x' + sha256(step.hash + currentHash);
      } else {
        currentHash = '0x' + sha256(currentHash + step.hash);
      }
    }
    return currentHash.toLowerCase() === expectedRoot.toLowerCase();
  }

  public tamperBlock(blockIndex: number, fakeMileage: number): boolean {
    if (blockIndex < 0 || blockIndex >= this.blocks.length) return false;
    this.blocks[blockIndex].mileage = fakeMileage;
    this.blocks[blockIndex].leafHash = this.hashBlock(this.blocks[blockIndex]);
    this.rebuildTree();
    return true;
  }
}
