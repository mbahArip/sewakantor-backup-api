import { Prisma } from '@prisma/client';

const parseJsonValue = (json: Prisma.JsonValue) => {
	const flatten = JSON.stringify(json);
	const data = JSON.parse(flatten);
	return data;
};

export default parseJsonValue;
