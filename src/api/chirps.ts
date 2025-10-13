import { Request, Response } from "express";
import { BadRequestErr } from "./errors.js";

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

export const handlerValidateChirp = (req: Request, res: Response) => {
  type requestBody = {
    body: string;
  };

  let data: requestBody = req.body;
  const maxChirpLength = 140;
  if (data.body.length > maxChirpLength) {
    // res.status(400).json({
    //   error: "Chirp is too long",
    // });
    // return;
    throw new BadRequestErr(
      `Chirp is too long. Max length is ${maxChirpLength}`
    );
  }
  const cleanedBody = cleanProfane(data.body);
  res.status(200).json({
    cleanedBody,
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
