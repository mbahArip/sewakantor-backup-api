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

	const { email, password, name, role }: { name: string; email: string; password: string; role: string } = req.body;
	if (!email || !password || !name || !role)
		return res
			.status(400)
			.json({ status: res.statusCode, success: false, message: 'Missing body', details: 'Email, password, name, and role are required' });
	if (password.length < 8)
		return res
			.status(400)
			.json({ status: res.statusCode, success: false, message: 'Password error', details: 'Password must be at least 8 characters long' });
	if (role.toUpperCase() !== 'ADMIN' && role.toUpperCase() !== 'SUPER')
		return res
			.status(400)
			.json({ status: res.statusCode, success: false, message: 'Missing body', details: 'Role must be either ADMIN or SUPER' });

	try {
		const dataResponse = await prisma.admin.create({
			data: {
				name: formatName(name),
				email,
				password: hashPassword(password),
				role: role.toUpperCase(),
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
			},
		});

		return res.status(201).json({ status: res.statusCode, success: true, message: 'Admin created', data: dataResponse });
	} catch (error) {
		if (error.message.includes('Admin_email_key')) {
			return res
				.status(400)
				.json({ status: res.statusCode, success: false, message: 'Email already exists', details: `${email} already registered` });
		}
		return res.status(500).json({ status: res.statusCode, success: false, message: 'Internal server error', details: error.message });
	}
};

export default handler;
