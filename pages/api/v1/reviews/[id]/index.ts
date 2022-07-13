import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../utils/prisma';
import cors from '../../../../../utils/cors';
import validateAPI from '../../../../../utils/authorize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await cors(req, res);

	if (req.method.toUpperCase() === 'GET') {
		try {
			const dataResponse = await prisma.reviews.findUnique({
				where: {
					id: req.query.id as string,
				},
			});

			if (!dataResponse)
				return res.status(404).json({
					status: res.statusCode,
					success: false,
					message: 'Not found',
					details: 'Review not found',
				});

			return res.status(200).json({ status: res.statusCode, success: true, message: 'Get success', data: dataResponse });
		} catch (error) {
			return res.status(500).json({ status: res.statusCode, success: false, message: 'Internal server error', details: error.message });
		}
	}

	if (req.method.toUpperCase() === 'PUT') {
		if (!validateAPI(req)) {
			return res.status(401).json({ status: res.statusCode, success: false, message: 'Unauthorized', details: 'Missing or invalid API key' });
		}
		const {
			rating,
			comment,
		}: {
			rating: number;
			comment: string;
		} = req.body;

		if (!rating || !comment)
			return res.status(400).json({
				status: res.statusCode,
				success: false,
				message: 'Missing body',
				details: 'rating and comment are required',
			});

		try {
			const dataResponse = await prisma.reviews.update({
				where: {
					id: req.query.id as string,
				},
				data: {
					rating,
					comment,
				},
			});

			if (!dataResponse)
				return res.status(404).json({
					status: res.statusCode,
					success: false,
					message: 'Not found',
					details: 'Review not found',
				});

			return res.status(200).json({ status: res.statusCode, success: true, message: 'Update success', data: dataResponse });
		} catch (error) {
			return res.status(500).json({ status: res.statusCode, success: false, message: 'Internal server error', details: error.message });
		}
	}

	if (req.method.toUpperCase() === 'DELETE') {
		if (!validateAPI(req)) {
			return res.status(401).json({ status: res.statusCode, success: false, message: 'Unauthorized', details: 'Missing or invalid API key' });
		}
		try {
			const dataResponse = await prisma.reviews.delete({
				where: {
					id: req.query.id as string,
				},
			});

			if (!dataResponse)
				return res.status(404).json({
					status: res.statusCode,
					success: false,
					message: 'Not found',
					details: 'Review not found',
				});

			return res.status(200).json({ status: res.statusCode, success: true, message: 'Delete success', data: dataResponse });
		} catch (error) {
			return res.status(500).json({ status: res.statusCode, success: false, message: 'Internal server error', details: error.message });
		}
	}

	return res.status(400).json({
		status: res.statusCode,
		success: false,
		message: 'Method not allowed',
		details: 'Only GET, PUT and DELETE method is allowed',
	});
};

export default handler;
