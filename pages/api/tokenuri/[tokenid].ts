import tokenuri from "../../../src/constants/tokenuri"
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const { tokenid } = req.query;

    return res.status(200).json(tokenuri[tokenid as string]);
}
