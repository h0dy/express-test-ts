import { Request, Response } from "express";
import { BadRequestErr } from "./errors.js";
import { createChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";
import { getBearerToken } from "../auth/authHeader.js";
import { validateJWT } from "../auth/jwt.js";
import { config } from "../config.js";

// manually parsing json requests
export const handlerValidateChirpManually = (req: Request, res: Response) => {
  type requestBody = {
    body: string;
  };

  let body = ""; // 1. Initialize string buffer

  // 2. Listen for data events
  req.on("data", (chunk) => {
    body += chunk;
  });

  let parsedBody: requestBody;
  // 3. Listen for end events
  req.on("end", () => {
    try {
      parsedBody = JSON.parse(body);
    } catch (error) {
      res.status(400).json({
        error: "Something went wrong",
      });
    }

    if (parsedBody.body.length > 140) {
      res.status(400).json({
        error: "Chirp is too long",
      });
      return;
    }
    res.status(200).json({
      valid: true,
    });
  });
};

const cleanProfane = (text: string) => {
  const profaneWords = ["kerfuffle", "sharbert", "fornax"];
  const cleanText = text.split(" ").map((word) => {
    if (profaneWords.includes(word.toLowerCase())) {
      return "****";
    }
    return word;
  });
  return cleanText.join(" ");
};

export const handlerCreateChirp = async (req: Request, res: Response) => {
  type requestBody = {
    body: string;
  };

  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret);

  let data: requestBody = req.body;
  const maxChirpLength = 140;

  if (!data.body || !userId) {
    throw new BadRequestErr("Missing required fields");
  }
  if (data.body.length > maxChirpLength) {
    throw new BadRequestErr(
      `Chirp is too long. Max length is ${maxChirpLength}`
    );
  }

  const cleanedBody = cleanProfane(data.body);

  const chirp = await createChirp({
    body: cleanedBody,
    userId,
  });

  res.status(201).json({ ...chirp });
};

export const handlerGetAllChirps = async (req: Request, res: Response) => {
  const chirps = await getAllChirps();
  res.status(200).json([...chirps]);
};

export const handlerGetChirp = async (req: Request, res: Response) => {
  const chirpId = req.params.chirpID;
  const chirp = await getChirp(chirpId);
  if (!chirp) {
    throw new BadRequestErr("chirp not found");
  }
  res.status(200).json({ ...chirp });
};
