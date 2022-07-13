import bcrypt from 'bcryptjs';

const GENERATE_SALT = bcrypt.genSaltSync(10);

export const hashPassword = (password: string) => {
	return bcrypt.hashSync(password, GENERATE_SALT);
};
export const checkPassword = (password: string, hash: string) => {
	return bcrypt.compareSync(password, hash);
};
