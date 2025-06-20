export function getPaginationParams(
	query: Record<string, unknown>,
	defaultSize = 10,
	maxSize = 100,
) {
	let page_size = Number.parseInt(query.page_size as string) || defaultSize;
	let page = Number.parseInt(query.page as string) || 1;
	if (page_size > maxSize) page_size = maxSize;
	if (page < 1) page = 1;
	const offset = (page - 1) * page_size;
	return { page_size, page, offset };
}
