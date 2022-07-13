import { NextApiRequest } from 'next';
import { checkPassword } from './hash';

const validateAPI = (req: NextApiRequest) => {
	const apikey = req.headers.apikey as string;
	const validAPI = checkPassword(process.env.UNHASHED_API, apikey || '');
	return validAPI;
};

export default validateAPI;
