import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/prisma';
import cors from '../../../../utils/cors';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await cors(req, res);
	try {
		const dataResponse = await prisma.bookings.create({
			data: {
				spaceId: '62cdfee8a20dc10bed0cc4de',
				userId: '62ccc98a35bb6a8c03cdd75a',
				type: 'Office room',
				startDate: new Date('2020-01-01').toISOString(),
				endDate: new Date('2020-01-11').toISOString(),
			},
		});

		return res.status(200).json({
			status: res.statusCode,
			success: true,
			message: 'Create success',
			data: dataResponse,
		});
	} catch (error) {
		return res.status(500).json({ status: res.statusCode, success: false, message: 'Internal server error', details: error.message });
	}
};

export default handler;
