import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../utils/prisma';
import cors from '../../../../../utils/cors';
import parseJsonValue from '../../../../../utils/parseJsonValue';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await cors(req, res);

	if (req.method.toUpperCase() !== 'GET')
		return res.status(400).json({ status: res.statusCode, success: false, message: 'Method not allowed', details: 'Only GET method is allowed' });

	try {
		const { date, type }: { date?: string; type?: string } = req.query;
		if (!date || !type)
			return res.status(400).json({ status: res.statusCode, success: false, message: 'Missing query', details: 'Date, and type is required' });

		const dataResponse = await prisma.spaces.findUnique({
			where: {
				id: req.query.id as string,
			},
			select: {
				id: true,
				name: true,
				bookings: true,
			},
		});

		if (!dataResponse)
			return res.status(404).json({
				status: res.statusCode,
				success: false,
				message: 'Not found',
				details: 'Space not found',
			});

		const bookings = dataResponse.bookings.filter((booking) => {
			const flatten = JSON.stringify(booking);
			const data = JSON.parse(flatten);
			return data.type.toLowerCase().includes(type.toLowerCase());
		});

		const available = [];
		bookings.forEach((booking) => {
			const flatten = JSON.stringify(booking);
			const data = JSON.parse(flatten);
			const currentDate = new Date(date);
			const startDate = new Date(data.startDate);
			const endDate = new Date(data.endDate);

			if (currentDate >= startDate && currentDate <= endDate) {
				available.push(false);
			} else {
				available.push(true);
			}
		});

		let result;
		if (available.includes(false)) {
			result = false;
		} else {
			result = true;
		}

		return res.status(200).json({ status: res.statusCode, success: true, message: 'Get success', data: { available: result } });
	} catch (error) {
		return res.status(500).json({ status: res.statusCode, success: false, message: 'Internal server error', details: error.message });
	}
};

export default handler;
