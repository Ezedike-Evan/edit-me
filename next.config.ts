import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		domains: ['picsum.photos'], // Allow external images from Lorem Pictus API
	},
}

export default nextConfig
