import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../utils/prisma';
import cors from '../../../../../utils/cors';
import { checkPassword, hashPassword } from '../../../../../utils/hash';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await cors(req, res);

	if (req.method.toUpperCase() !== 'POST')
		return res
			.status(400)
			.json({ status: res.statusCode, success: false, message: 'Method not allowed', details: 'Only POST method is allowed' });

	if (!req.body) return res.status(400).json({ status: res.statusCode, success: false, message: 'Missing body', details: 'Body is required' });

	const { email, password }: { email: string; password: string } = req.body;
	if (!email || !password)
		return res.status(400).json({ status: res.statusCode, success: false, message: 'Missing body', details: 'Email, and password are required' });

	try {
		const dataResponse = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (!dataResponse)
			return res.status(404).json({ status: res.statusCode, success: false, message: 'User not found', details: `Please recheck your email` });

		if (!checkPassword(password, dataResponse.password))
			return res
				.status(200)
				.json({ status: res.statusCode, success: false, message: 'Wrong password', details: 'Please recheck your password' });

		const { id, name, email: returnEmail, avatar } = dataResponse;
		const returnData = {
			id,
			name,
			returnEmail,
			avatar,
			apiKey: hashPassword(process.env.UNHASHED_API),
		};

		return res.status(200).json({
			status: res.statusCode,
			success: true,
			message: 'Login success',
			data: returnData,
		});
	} catch (error) {
		return res.status(500).json({ status: res.statusCode, success: false, message: 'Internal server error', details: error.message });
	}
};

export default handler;
