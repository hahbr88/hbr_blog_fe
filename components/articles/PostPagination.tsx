'use client';

import { Pagination } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';

type PostPaginationProps = {
	page: number;
	total: number;
};

export default function PostPagination({ page, total }: PostPaginationProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	return (
		<Pagination
			value={page}
			total={Math.max(1, total)}
			withEdges
			onChange={(next) => {
				const params = new URLSearchParams(searchParams.toString());

				if (next <= 1) {
					params.delete('page');
				} else {
					params.set('page', String(next));
				}

				const query = params.toString();
				router.push(query ? `/posts?${query}` : '/posts');
			}}
		/>
	);
}
