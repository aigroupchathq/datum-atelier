import { sha256 } from '../crypto/sha256';

/**
 * DATUM Atelier — Carnet Vault & Custody Transfer Engine
 * 
 * Cryptographic transit token issuance, multi-sig council notary validation,
 * and immutable transfer certificate lineage for cross-border high-value
 * collector motorcars under international conventions (ATA Carnet, TIR, Bilateral).
 */

export interface CarnetToken {
  id: string;
  vin: string;
  ownerPubKey: string;
  issuedAt: string;
  expiresAt: string;
  tokenHash: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'TRANSFERRED';
  jurisdictions: string[];
  coverageType: 'ATA_CARNET' | 'EU_TIR' | 'BILATERAL_TREATY';
}

export interface CouncilSignature {
  signerName: string;
  signerRole: 'OWNER' | 'CUSTODIAN' | 'INSURER' | 'AUTHORITY';
  publicKey: string;
  signatureHash: string;
  timestamp: string;
}

export interface TransferCertificate {
  certificateId: string;
  tokenId: string;
  fromOwner: string;
  toOwner: string;
  transferTimestamp: string;
  councilSignatures: CouncilSignature[];
  merkleRootAtTransfer: string;
  isValid: boolean;
  transferHash: string;
}

export class CarnetVaultEngine {
  private tokens: Map<string, CarnetToken> = new Map();
  private certificates: TransferCertificate[] = [];

  /**
   * Generates and registers a time-locked, cryptographically hashed CarnetToken.
   *
   * @param vin - Vehicle Identification Number
   * @param ownerPubKey - Hex or base58 public key of the legal custodian/owner
   * @param jurisdictions - ISO country codes or customs territories (e.g. ['GB', 'FR', 'CH', 'IT'])
   * @param coverageType - International customs regulatory framework
   * @param validityDays - Token duration in days (default 365)
   * @returns Newly issued and registered CarnetToken
   */
  public issueToken(
    vin: string,
    ownerPubKey: string,
    jurisdictions: string[],
    coverageType: CarnetToken['coverageType'],
    validityDays: number = 365
  ): CarnetToken {
    const sanitizedVin = vin.trim().toUpperCase();
    const issuedAt = new Date().toISOString();
    const expiresDate = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000);
    const expiresAt = expiresDate.toISOString();

    const uniqueNonce = Math.random().toString(36).substring(2, 8).toUpperCase();
    const tokenId = `CARNET-${sanitizedVin.slice(-6)}-${Date.now().toString(36).toUpperCase()}-${uniqueNonce}`;

    const sortedJurisdictions = [...jurisdictions].sort();
    const hashPayload = [
      'CARNET_TOKEN_V1',
      tokenId,
      sanitizedVin,
      ownerPubKey,
      issuedAt,
      expiresAt,
      sortedJurisdictions.join(','),
      coverageType,
    ].join(':');

    const tokenHash = sha256(hashPayload);

    const token: CarnetToken = {
      id: tokenId,
      vin: sanitizedVin,
      ownerPubKey,
      issuedAt,
      expiresAt,
      tokenHash,
      status: 'ACTIVE',
      jurisdictions: sortedJurisdictions,
      coverageType,
    };

    this.tokens.set(token.id, token);
    return token;
  }

  /**
   * Revokes an existing token, rendering it void for customs or transit claims.
   *
   * @param tokenId - Identifier of the Carnet token to revoke
   * @returns true if token was found and revoked, false otherwise
   */
  public revokeToken(tokenId: string): boolean {
    const token = this.tokens.get(tokenId);
    if (!token) {
      return false;
    }
    token.status = 'REVOKED';
    this.tokens.set(tokenId, token);
    return true;
  }

  /**
   * Verifies if a token exists, remains active, and has not lapsed past its expiry timestamp.
   * Automatically updates status to EXPIRED if time lock has expired.
   *
   * @param tokenId - Token identifier to evaluate
   * @returns boolean indicating valid active standing
   */
  public isTokenValid(tokenId: string): boolean {
    const token = this.tokens.get(tokenId);
    if (!token) {
      return false;
    }

    if (token.status !== 'ACTIVE') {
      return false;
    }

    const now = Date.now();
    const expiryTime = new Date(token.expiresAt).getTime();
    if (now >= expiryTime) {
      token.status = 'EXPIRED';
      this.tokens.set(tokenId, token);
      return false;
    }

    return true;
  }

  /**
   * Generates a signed council approval hash conforming to the 4-party notary architecture.
   *
   * @param signerName - Human-readable legal or organizational name
   * @param signerRole - Quorum council seat role
   * @param publicKey - Signer's cryptographic public key
   * @param message - Intent statement or transfer reference
   * @returns Cryptographically notarized CouncilSignature
   */
  public signCouncilApproval(
    signerName: string,
    signerRole: CouncilSignature['signerRole'],
    publicKey: string,
    message: string
  ): CouncilSignature {
    const timestamp = new Date().toISOString();
    const payload = ['COUNCIL_APPROVAL_V1', signerName, signerRole, publicKey, message, timestamp].join(':');
    const signatureHash = sha256(payload);

    return {
      signerName,
      signerRole,
      publicKey,
      signatureHash,
      timestamp,
    };
  }

  /**
   * Initiates vehicle custody transfer under multi-sig council notarization.
   * Validates minimum 2 council signatures, creates an immutable TransferCertificate,
   * transitions the source token to TRANSFERRED, and issues a successor token to the recipient.
   *
   * @param tokenId - Identifier of the active CarnetToken being transferred
   * @param toOwner - Public key of the recipient owner / custodian
   * @param councilSignatures - Multi-sig council approvals (minimum 2 required)
   * @param merkleRootAtTransfer - Merkle DAG root hash anchoring this transfer in the provenance ledger
   * @returns Newly minted TransferCertificate
   */
  public initiateTransfer(
    tokenId: string,
    toOwner: string,
    councilSignatures: CouncilSignature[],
    merkleRootAtTransfer: string
  ): TransferCertificate {
    const oldToken = this.tokens.get(tokenId);
    if (!oldToken) {
      throw new Error(`Carnet token with ID '${tokenId}' does not exist.`);
    }

    if (oldToken.status === 'REVOKED') {
      throw new Error(`Transfer rejected: Carnet token '${tokenId}' is revoked.`);
    }

    if (oldToken.status === 'TRANSFERRED') {
      throw new Error(`Transfer rejected: Carnet token '${tokenId}' has already been transferred.`);
    }

    const now = Date.now();
    const expiryTime = new Date(oldToken.expiresAt).getTime();
    if (now >= expiryTime) {
      oldToken.status = 'EXPIRED';
      this.tokens.set(tokenId, oldToken);
      throw new Error(`Transfer rejected: Carnet token '${tokenId}' expired at ${oldToken.expiresAt}.`);
    }

    if (!councilSignatures || councilSignatures.length < 2) {
      throw new Error(
        `Transfer rejected: Council multi-sig threshold failure. Minimum 2 signatures required, received ${
          councilSignatures ? councilSignatures.length : 0
        }.`
      );
    }

    // Ensure distinct signer public keys
    const distinctKeys = new Set<string>();
    for (const sig of councilSignatures) {
      if (!sig.publicKey || !sig.signatureHash) {
        throw new Error(`Transfer rejected: Malformed council signature entry from '${sig.signerName}'.`);
      }
      if (distinctKeys.has(sig.publicKey)) {
        throw new Error(`Transfer rejected: Duplicate council signature detected for public key '${sig.publicKey}'.`);
      }
      distinctKeys.add(sig.publicKey);
    }

    const certificateNonce = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certificateId = `TCERT-${oldToken.vin.slice(-6)}-${Date.now().toString(36).toUpperCase()}-${certificateNonce}`;
    const transferTimestamp = new Date().toISOString();

    const sortedSigHashes = councilSignatures.map((s) => s.signatureHash).sort();
    const transferPayload = [
      'TRANSFER_CERTIFICATE_V1',
      certificateId,
      oldToken.id,
      oldToken.ownerPubKey,
      toOwner,
      transferTimestamp,
      merkleRootAtTransfer,
      sortedSigHashes.join(':'),
    ].join(':');

    const transferHash = sha256(transferPayload);

    const certificate: TransferCertificate = {
      certificateId,
      tokenId: oldToken.id,
      fromOwner: oldToken.ownerPubKey,
      toOwner,
      transferTimestamp,
      councilSignatures: [...councilSignatures],
      merkleRootAtTransfer,
      isValid: true,
      transferHash,
    };

    // Transition old token
    oldToken.status = 'TRANSFERRED';
    this.tokens.set(oldToken.id, oldToken);

    // Calculate remaining validity days or provide default
    const remainingMs = Math.max(86_400_000, expiryTime - now);
    const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));

    // Issue successor token to recipient
    this.issueToken(oldToken.vin, toOwner, oldToken.jurisdictions, oldToken.coverageType, remainingDays);

    this.certificates.push(certificate);
    return certificate;
  }

  /**
   * Retrieves the complete cryptographic transfer certificate chain for a vehicle VIN.
   *
   * @param vin - Vehicle Identification Number
   * @returns Array of TransferCertificates associated with this VIN in chronological order
   */
  public getCertificateChain(vin: string): TransferCertificate[] {
    const sanitizedVin = vin.trim().toUpperCase();
    return this.certificates.filter((cert) => {
      const token = this.tokens.get(cert.tokenId);
      return token ? token.vin === sanitizedVin : false;
    });
  }

  /**
   * Retrieves a token by its unique identifier.
   */
  public getToken(tokenId: string): CarnetToken | undefined {
    return this.tokens.get(tokenId);
  }

  /**
   * Returns all tokens currently recorded in the vault.
   */
  public getAllTokens(): CarnetToken[] {
    return Array.from(this.tokens.values());
  }

  /**
   * Returns all transfer certificates recorded in the vault.
   */
  public getAllCertificates(): TransferCertificate[] {
    return [...this.certificates];
  }

  /**
   * Returns all active tokens currently stored in the vault.
   */
  public getActiveTokens(): CarnetToken[] {
    return this.getAllTokens().filter((t) => this.isTokenValid(t.id));
  }

  /**
   * Clears internal state. Primarily useful for unit testing and demo re-seeding.
   */
  public reset(): void {
    this.tokens.clear();
    this.certificates = [];
  }
}

export const defaultVaultEngine = new CarnetVaultEngine();
