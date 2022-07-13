import Cors, { CorsRequest } from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

function initMiddleware(middleware: any) {
	return (req: NextApiRequest, res: NextApiResponse) =>
		new Promise((resolve, reject) => {
			middleware(req, res, (result: any) => {
				if (result instanceof Error) {
					return reject(result);
				}
				return resolve(result);
			});
		});
}

const cors = initMiddleware(
	Cors({
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	}),
);

export default cors;
