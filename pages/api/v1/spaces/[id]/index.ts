import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../utils/prisma';
import cors from '../../../../../utils/cors';
import validateAPI from '../../../../../utils/authorize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await cors(req, res);

	if (req.method.toUpperCase() === 'GET') {
		try {
			const dataResponse = await prisma.spaces.findUnique({
				where: {
					id: req.query.id as string,
				},
				select: {
					id: true,
					name: true,
					address: true,
					description: true,
					accessHours: true,
					nearbyPlaces: true,
					facilities: true,
					types: true,
					images: true,
					roomplan: true,
					reviews: true,
					bookings: true,
					savedBy: true,
				},
			});

			if (!dataResponse)
				return res.status(404).json({
					status: res.statusCode,
					success: false,
					message: 'Not found',
					details: 'Space not found',
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
			name,
			address,
			description,
			accessHours,
			nearbyPlaces,
			facilities,
			types,
			images,
			roomplan,
		}: {
			name: string;
			address: string;
			description: string;
			accessHours: object;
			nearbyPlaces: object[];
			facilities: string[];
			types: object[];
			images: string[];
			roomplan: string;
		} = req.body;

		try {
			const dataResponse = await prisma.spaces.update({
				where: { id: req.query.id as string },
				data: {
					name,
					address,
					description,
					accessHours,
					nearbyPlaces,
					facilities,
					types,
					images,
					roomplan,
				},
			});

			return res.status(200).json({ status: res.statusCode, success: true, message: 'Update success', data: dataResponse });
		} catch (error) {
			if (error.message.includes('not found'))
				return res.status(404).json({ status: res.statusCode, success: false, message: 'Not found', details: 'Space ID not found' });

			return res.status(500).json({ status: res.statusCode, success: false, message: 'Internal server error', details: error.message });
		}
	}

	if (req.method.toUpperCase() === 'DELETE') {
		if (!validateAPI(req)) {
			return res.status(401).json({ status: res.statusCode, success: false, message: 'Unauthorized', details: 'Missing or invalid API key' });
		}

		try {
			const dataResponse = await prisma.spaces.delete({
				where: { id: req.query.id as string },
			});

			return res.status(200).json({ status: res.statusCode, success: true, message: 'Delete success', data: dataResponse });
		} catch (error) {
			if (error.message.includes('not found'))
				return res.status(404).json({ status: res.statusCode, success: false, message: 'Not found', details: 'Space ID not found' });

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
