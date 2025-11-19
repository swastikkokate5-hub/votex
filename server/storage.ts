import {
  type Officer,
  type InsertOfficer,
  type Voter,
  type InsertVoter,
  type Candidate,
  type InsertCandidate,
  type Vote,
  type InsertVote,
  type AuditLog,
  type InsertAuditLog,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Officers
  getOfficer(id: string): Promise<Officer | undefined>;
  getOfficerByOfficerId(officerId: string): Promise<Officer | undefined>;
  createOfficer(officer: InsertOfficer): Promise<Officer>;

  // Voters
  getVoter(id: string): Promise<Voter | undefined>;
  getVoterByVoterId(voterId: string): Promise<Voter | undefined>;
  updateVoter(id: string, updates: Partial<Voter>): Promise<Voter | undefined>;
  
  // Candidates
  getCandidatesByBoothId(boothId: string): Promise<Candidate[]>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  
  // Votes
  createVote(vote: InsertVote): Promise<Vote>;
  getVotesByBoothId(boothId: string): Promise<Vote[]>;
  
  // Audit Logs
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogsByBoothId(boothId: string): Promise<AuditLog[]>;
}

export class MemStorage implements IStorage {
  private officers: Map<string, Officer>;
  private voters: Map<string, Voter>;
  private candidates: Map<string, Candidate>;
  private votes: Map<string, Vote>;
  private auditLogs: Map<string, AuditLog>;

  constructor() {
    this.officers = new Map();
    this.voters = new Map();
    this.candidates = new Map();
    this.votes = new Map();
    this.auditLogs = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed officers
    const officer: Officer = {
      id: randomUUID(),
      officerId: "OFF001",
      password: "password123",
      name: "Officer Ramesh Singh",
      boothId: "BH-042",
    };
    this.officers.set(officer.id, officer);

    // Seed voters
    const voters: InsertVoter[] = [
      {
        voterId: "VOT123456789",
        name: "Rajesh Kumar",
        age: 34,
        address: "123 Main Street, Mumbai, MH 400001",
        boothId: "BH-042",
        hasVoted: false,
      },
      {
        voterId: "VOT987654321",
        name: "Priya Sharma",
        age: 28,
        address: "456 Park Avenue, Mumbai, MH 400002",
        boothId: "BH-042",
        hasVoted: false,
      },
      {
        voterId: "VOT456789123",
        name: "Amit Patel",
        age: 42,
        address: "789 Lake Road, Mumbai, MH 400003",
        boothId: "BH-042",
        hasVoted: false,
      },
    ];

    voters.forEach((v) => {
      const voter: Voter = {
        ...v,
        id: randomUUID(),
        photoUrl: null,
        fingerprintTemplate: null,
        hasVoted: v.hasVoted ?? false,
      };
      this.voters.set(voter.id, voter);
    });

    // Seed candidates
    const candidates: InsertCandidate[] = [
      {
        name: "Rajiv Sharma",
        partyName: "Progressive Party",
        partySymbol: "lotus",
        boothId: "BH-042",
      },
      {
        name: "Meera Reddy",
        partyName: "Unity Alliance",
        partySymbol: "hand",
        boothId: "BH-042",
      },
      {
        name: "Arjun Patel",
        partyName: "Democratic Front",
        partySymbol: "elephant",
        boothId: "BH-042",
      },
      {
        name: "Kavita Singh",
        partyName: "People's Movement",
        partySymbol: "wheel",
        boothId: "BH-042",
      },
    ];

    candidates.forEach((c) => {
      const candidate: Candidate = { ...c, id: randomUUID() };
      this.candidates.set(candidate.id, candidate);
    });
  }

  // Officers
  async getOfficer(id: string): Promise<Officer | undefined> {
    return this.officers.get(id);
  }

  async getOfficerByOfficerId(officerId: string): Promise<Officer | undefined> {
    return Array.from(this.officers.values()).find((o) => o.officerId === officerId);
  }

  async createOfficer(insertOfficer: InsertOfficer): Promise<Officer> {
    const id = randomUUID();
    const officer: Officer = { ...insertOfficer, id };
    this.officers.set(id, officer);
    return officer;
  }

  // Voters
  async getVoter(id: string): Promise<Voter | undefined> {
    return this.voters.get(id);
  }

  async getVoterByVoterId(voterId: string): Promise<Voter | undefined> {
    return Array.from(this.voters.values()).find((v) => v.voterId === voterId);
  }

  async updateVoter(id: string, updates: Partial<Voter>): Promise<Voter | undefined> {
    const voter = this.voters.get(id);
    if (!voter) return undefined;
    const updated = { ...voter, ...updates };
    this.voters.set(id, updated);
    return updated;
  }

  // Candidates
  async getCandidatesByBoothId(boothId: string): Promise<Candidate[]> {
    return Array.from(this.candidates.values()).filter((c) => c.boothId === boothId);
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const id = randomUUID();
    const candidate: Candidate = { ...insertCandidate, id };
    this.candidates.set(id, candidate);
    return candidate;
  }

  // Votes
  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = randomUUID();
    const vote: Vote = {
      ...insertVote,
      id,
      timestamp: new Date(),
    };
    this.votes.set(id, vote);
    return vote;
  }

  async getVotesByBoothId(boothId: string): Promise<Vote[]> {
    return Array.from(this.votes.values()).filter((v) => v.boothId === boothId);
  }

  // Audit Logs
  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const id = randomUUID();
    const log: AuditLog = {
      ...insertLog,
      id,
      timestamp: new Date(),
      voterId: insertLog.voterId ?? null,
      details: insertLog.details ?? null,
    };
    this.auditLogs.set(id, log);
    return log;
  }

  async getAuditLogsByBoothId(boothId: string): Promise<AuditLog[]> {
    return Array.from(this.auditLogs.values())
      .filter((l) => l.boothId === boothId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const storage = new MemStorage();
