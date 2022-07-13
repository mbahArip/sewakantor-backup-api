import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../utils/prisma';
import cors from '../../../../../utils/cors';
import validateAPI from '../../../../../utils/authorize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await cors(req, res);

	if (req.method.toUpperCase() !== 'POST')
		return res
			.status(400)
			.json({ status: res.statusCode, success: false, message: 'Method not allowed', details: 'Only POST method is allowed' });

	if (!validateAPI(req))
		return res.status(401).json({ status: res.statusCode, success: false, message: 'Unauthorized', details: 'Missing or invalid API key' });

	const { reply }: { reply: string } = req.body;

	if (!reply) return res.status(400).json({ status: res.statusCode, success: false, message: 'Missing body', details: 'reply is required' });

	try {
		const dataResponse = await prisma.reviews.update({
			where: {
				id: req.query.id as string,
			},
			data: {
				reply,
			},
		});

		return res.status(200).json({
			status: res.statusCode,
			success: true,
			message: 'Update success',
			data: dataResponse,
		});
	} catch (error) {
		if (error.message.includes('not found'))
			return res.status(404).json({ status: res.statusCode, success: false, message: 'Not found', details: 'Space ID not found' });

		return res.status(500).json({ status: res.statusCode, success: false, message: 'Internal server error', details: error.message });
	}
};

export default handler;
