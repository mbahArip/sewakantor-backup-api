import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../utils/prisma';
import cors from '../../../../../utils/cors';
import { hashPassword } from '../../../../../utils/hash';

const formatName = (name: string) => {
	return name
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await cors(req, res);

	if (req.method.toUpperCase() !== 'POST')
		return res
			.status(400)
			.json({ status: res.statusCode, success: false, message: 'Method not allowed', details: 'Only POST method is allowed' });

	if (!req.body) return res.status(400).json({ status: res.statusCode, success: false, message: 'Missing body', details: 'Body is required' });

	const { email, password, name }: { name: string; email: string; password: string } = req.body;
	if (!email || !password || !name)
		return res
			.status(400)
			.json({ status: res.statusCode, success: false, message: 'Missing body', details: 'Email, password and name are required' });
	if (password.length < 8)
		return res
			.status(400)
			.json({ status: res.statusCode, success: false, message: 'Password error', details: 'Password must be at least 8 characters long' });

	try {
		const dataResponse = await prisma.user.create({
			data: {
				name: formatName(name),
				email,
				password: hashPassword(password),
			},
			select: {
				id: true,
				name: true,
				email: true,
				password: true,
			},
		});

		return res.status(201).json({ status: res.statusCode, success: true, message: 'User created', data: dataResponse });
	} catch (error) {
		if (error.message.includes('User_email_key')) {
			return res
				.status(400)
				.json({ status: res.statusCode, success: false, message: 'Email already exists', details: `${email} already registered` });
		}
		return res.status(500).json({ status: res.statusCode, success: false, message: 'Internal server error', details: error.message });
	}
};

export default handler;
