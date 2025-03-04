'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const IMAGES_PER_PAGE = 12

const Home = () => {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [images, setImages] = useState([])
	const page = Number(searchParams.get('page')) || 1

	const fetchImages = async (page: number) => {
		const res = await fetch(
			`https://picsum.photos/v2/list?page=${page}&limit=${IMAGES_PER_PAGE}`
		)
		const images = await res.json()
		setImages(images)
	}

	useEffect(() => {
		document.title = 'Edit me | Image Gallery'
	}, [])

	useEffect(() => {
		fetchImages(page)
	}, [page]) // Fetch images whenever page number changes

	return (
		<div className="min-h-screen p-5">
			<h1 className="text-2xl font-bold mb-5">Edit Me</h1>

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
				{images.map((image: any) => (
					<div
						key={image.id}
						className="overflow-hidden border rounded-md"
					>
						<Link href={`/edit/${image.id}?page=${page}`}>
							<Image
								src={image.download_url}
								alt={image.author}
								width={250}
								height={100}
								className="object-cover w-full h-40 cursor-pointer"
							/>
							<p className="text-center font-medium my-2 text-sm">
								{image.author}
							</p>
						</Link>
					</div>
				))}
			</div>
			<div className="flex justify-center items-center gap-4 mt-5">
				<button
					onClick={() => router.push(`/?page=${page > 1 ? page - 1 : 1}`)}
					className="px-4 py-2 bg-gray-900 text-white font-medium rounded disabled:opacity-50 "
					disabled={page === 1}
				>
					Previous
				</button>
				<span className="bg-black text-white font-medium py-2 w-6 flex justify-center items-center h-6 px-2 rounded-full">
					{page}
				</span>
				<button
					onClick={() => router.push(`/?page=${page + 1}`)}
					className="px-4 py-2 bg-gray-300 font-medium rounded"
				>
					Next
				</button>
			</div>
		</div>
	)
}

export default Home
