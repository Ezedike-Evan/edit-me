'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useParams, useSearchParams } from 'next/navigation'

const EditPage = () => {
	const params = useParams()
	const searchParams = useSearchParams()
	const id = params.id as string
	const router = useRouter()
	const page = Number(searchParams.get('page')) || 1

	const [width, setWidth] = useState(500)
	const [height, setHeight] = useState(300)
	const [grayscale, setGrayscale] = useState(false)
	const [blur, setBlur] = useState(0)

	useEffect(() => {
		const savedSettings = localStorage.getItem(`image-settings-${id}`)
		if (savedSettings) {
			const { width, height, grayscale, blur } = JSON.parse(savedSettings)
			setWidth(width)
			setHeight(height)
			setGrayscale(grayscale)
			setBlur(blur)
		}
	}, [id]) // Load settings when the image ID changes

	// Save settings whenever they change
	useEffect(() => {
		const settings = { width, height, grayscale, blur }
		localStorage.setItem(`image-settings-${id}`, JSON.stringify(settings))
	}, [width, height, grayscale, blur, id])

	const imageUrl = `https://picsum.photos/id/${id}/${width}/${height}?${
		grayscale && 'grayscale'
	}&${blur && `blur=${blur}`}`

	const downloadImage = async () => {
		try {
			const response = await fetch(imageUrl)
			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `edited-image-${id}.jpg`
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
		} catch (error) {
			console.error('Failed to download image', error)
		}
	}

	return (
		<div className="min-h-screen p-5">
			<h1 className="text-2xl font-bold mb-5">Edit Image</h1>
			<div className="flex flex-col md:flex-row justify-between">
				{/* Image Preview */}
				<div>
					<Image
						src={imageUrl}
						alt="Edited Image"
						width={width}
						height={height}
						className="rounded-md border flex"
					/>
				</div>

				{/* Controls */}
				<div className="mt-5 flex flex-col gap-4 w-80">
					<div className="flex flex-col">
						<label>Width:</label>
						<input
							type="number"
							value={width}
							onChange={(e) => setWidth(Number(e.target.value))}
							className="border px-2 py-1 rounded"
						/>
					</div>
					<div className="flex flex-col">
						<label>Height:</label>
						<input
							type="number"
							value={height}
							onChange={(e) => setHeight(Number(e.target.value))}
							className="border px-2 py-1 rounded"
						/>
					</div>
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={grayscale}
							onChange={() => setGrayscale(!grayscale)}
						/>
						<span>Grayscale</span>
					</div>
					<div className="flex flex-col">
						<span>Blur: {blur}</span>
						<input
							type="range"
							min="0"
							max="10"
							value={blur}
							onChange={(e) => setBlur(Number(e.target.value))}
							className="w-full"
						/>
					</div>

					{/* Buttons */}
					<div className="flex gap-4">
						<button
							onClick={() => router.push(`/?page=${page}`)}
							className="px-4 py-2 bg-gray-300 rounded"
						>
							Back to Gallery
						</button>
						<button
							onClick={downloadImage}
							className="px-4 py-2 bg-gray-900 text-white font-medium rounded"
						>
							Download Image
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EditPage
