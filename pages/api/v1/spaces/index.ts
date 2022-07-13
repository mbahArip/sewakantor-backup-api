import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/prisma';
import cors from '../../../../utils/cors';
import validateAPI from '../../../../utils/authorize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await cors(req, res);

	if (req.method.toUpperCase() === 'GET') {
		try {
			const dataResponse = await prisma.spaces.findMany({
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

			return res.status(200).json({ status: res.statusCode, success: true, message: 'Get success', data: dataResponse });
		} catch (error) {
			return res.status(500).json({ status: res.statusCode, success: false, message: 'Internal server error', details: error.message });
		}
	}
	if (req.method.toUpperCase() === 'POST') {
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
			accessHours: { mon: string; tue: string; wed: string; thu: string; fri: string; sat: string; sun: string };
			nearbyPlaces: { placename: string; distance: number }[];
			facilities: string[];
			types: { type: string; unit: number };
			images: string[];
			roomplan: string;
		} = req.body;

		if (!name || !address || !description || !accessHours || !nearbyPlaces || !facilities || !types || !images || !roomplan)
			return res.status(400).json({
				status: res.statusCode,
				success: false,
				message: 'Missing body',
				details: 'Name, address, description, accessHours, nearbyPlaces, facilities, types, images, roomplan are required',
			});

		try {
			const dataResponse = await prisma.spaces.create({
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
			return res.status(200).json({ status: res.statusCode, success: true, message: 'Post success', data: dataResponse });
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
