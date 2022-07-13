// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { checkPassword, hashPassword } from '../../utils/hash';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const apikey = req.headers.apikey as string;
	const validAPI = checkPassword(process.env.UNHASHED_API, apikey);
	return res.json({ validAPI });
}
