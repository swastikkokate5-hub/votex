import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVoteSchema, insertAuditLogSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Officer login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { officerId, password } = req.body;

      console.log("Login attempt - Officer ID:", officerId, "Password:", password);

      if (!officerId || !password) {
        return res.status(400).json({ error: "Officer ID and password required" });
      }

      const officer = await storage.getOfficerByOfficerId(officerId);
      console.log("Found officer:", officer ? `${officer.officerId} (password: ${officer.password})` : "NOT FOUND");

      if (!officer || officer.password !== password) {
        await storage.createAuditLog({
          action: "Failed Officer Login",
          officerId: officerId,
          boothId: "UNKNOWN",
          details: "Invalid credentials",
        });
        return res.status(401).json({ error: "Invalid credentials" });
      }

      await storage.createAuditLog({
        action: "Officer Login",
        officerId: officer.officerId,
        boothId: officer.boothId,
        details: "Successful login",
      });

      res.json({
        officer: {
          id: officer.id,
          officerId: officer.officerId,
          name: officer.name,
          boothId: officer.boothId,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get voter by voter ID
  app.get("/api/voters/:voterId", async (req, res) => {
    try {
      const { voterId } = req.params;
      const voter = await storage.getVoterByVoterId(voterId);

      if (!voter) {
        return res.status(404).json({ error: "Voter not found" });
      }

      res.json({ voter });
    } catch (error) {
      console.error("Get voter error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get candidates by booth
  app.get("/api/candidates", async (req, res) => {
    try {
      const { boothId } = req.query;

      if (!boothId || typeof boothId !== "string") {
        return res.status(400).json({ error: "Booth ID required" });
      }

      const candidates = await storage.getCandidatesByBoothId(boothId);
      res.json({ candidates });
    } catch (error) {
      console.error("Get candidates error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Submit vote
  app.post("/api/votes", async (req, res) => {
    try {
      const voteData = insertVoteSchema.parse(req.body);

      // Check if voter exists and hasn't voted
      const voter = await storage.getVoterByVoterId(voteData.voterId);
      if (!voter) {
        return res.status(404).json({ error: "Voter not found" });
      }

      if (voter.hasVoted) {
        await storage.createAuditLog({
          action: "Duplicate Vote Attempt",
          voterId: voteData.voterId,
          officerId: voteData.officerId,
          boothId: voteData.boothId,
          details: "Voter already voted",
        });
        return res.status(400).json({ error: "Voter has already voted" });
      }

      // Create vote
      const vote = await storage.createVote(voteData);

      // Mark voter as voted
      await storage.updateVoter(voter.id, { hasVoted: true });

      // Create audit log
      await storage.createAuditLog({
        action: "Vote Submitted",
        voterId: voteData.voterId,
        officerId: voteData.officerId,
        boothId: voteData.boothId,
        details: `Face: ${voteData.faceMatchScore}%, Fingerprint: ${voteData.fingerprintMatchScore}%`,
      });

      res.json({ vote, message: "Vote submitted successfully" });
    } catch (error) {
      console.error("Submit vote error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const { boothId } = req.query;

      if (!boothId || typeof boothId !== "string") {
        return res.status(400).json({ error: "Booth ID required" });
      }

      const votes = await storage.getVotesByBoothId(boothId);
      const auditLogs = await storage.getAuditLogsByBoothId(boothId);

      const totalVerified = votes.length;
      const suspicious = auditLogs.filter(
        (log) => log.action.includes("Failed") || log.action.includes("Duplicate")
      ).length;

      res.json({
        totalVerified,
        pending: 0,
        suspicious,
      });
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get recent activity
  app.get("/api/dashboard/activity", async (req, res) => {
    try {
      const { boothId } = req.query;

      if (!boothId || typeof boothId !== "string") {
        return res.status(400).json({ error: "Booth ID required" });
      }

      const logs = await storage.getAuditLogsByBoothId(boothId);
      const recentLogs = logs.slice(0, 10);

      const activity = await Promise.all(
        recentLogs.map(async (log) => {
          let voter;
          if (log.voterId) {
            voter = await storage.getVoterByVoterId(log.voterId);
          }

          let status: "success" | "rejected" | "suspicious" = "success";
          if (log.action.includes("Failed") || log.action.includes("Rejected")) {
            status = "rejected";
          } else if (log.action.includes("Duplicate") || log.action.includes("Suspicious")) {
            status = "suspicious";
          }

          return {
            id: log.id,
            voterId: log.voterId || "N/A",
            voterName: voter?.name || "Unknown",
            action: log.action,
            status,
            timestamp: log.timestamp.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        })
      );

      res.json({ activity });
    } catch (error) {
      console.error("Get activity error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create audit log
  app.post("/api/audit", async (req, res) => {
    try {
      const logData = insertAuditLogSchema.parse(req.body);
      const log = await storage.createAuditLog(logData);
      res.json({ log });
    } catch (error) {
      console.error("Create audit log error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
