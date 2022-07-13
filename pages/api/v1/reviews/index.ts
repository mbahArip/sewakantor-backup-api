import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/prisma';
import cors from '../../../../utils/cors';
import validateAPI from '../../../../utils/authorize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await cors(req, res);

	if (req.method.toUpperCase() === 'GET') {
		try {
			const dataResponse = await prisma.reviews.findMany();

			return res.status(200).json({
				status: res.statusCode,
				success: true,
				message: 'Get success',
				data: dataResponse,
			});
		} catch (error) {
			return res.status(500).json({ status: res.statusCode, success: false, message: 'Internal server error', details: error.message });
		}
	}

	if (req.method.toUpperCase() === 'POST') {
		if (!validateAPI(req)) {
			return res.status(401).json({ status: res.statusCode, success: false, message: 'Unauthorized', details: 'Missing or invalid API key' });
		}

		const {
			spaceId,
			userId,
			rating,
			comment,
		}: {
			spaceId: string;
			userId: string;
			rating: number;
			comment: string;
		} = req.body;

		if (!spaceId || !userId || !rating || !comment)
			return res.status(400).json({
				status: res.statusCode,
				success: false,
				message: 'Missing body',
				details: 'sSpaceId, userId, rating, and comment are required',
			});

		try {
			const dataResponse = await prisma.reviews.create({
				data: {
					spaceId,
					userId,
					rating,
					comment,
				},
			});

			return res.status(200).json({
				status: res.statusCode,
				success: true,
				message: 'Post success',
				data: dataResponse,
			});
		} catch (error) {
			return res.status(500).json({ status: res.statusCode, success: false, message: 'Internal server error', details: error.message });
		}
	}

	return res.status(400).json({
		status: res.statusCode,
		success: false,
		message: 'Method not allowed',
		details: 'Only GET, and POST method is allowed',
	});
};

export default handler;
