/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    'images': {
        'domains': ['mrecohealthy.com'],
        loader: 'custom',
        loaderFile: './app/image.ts',
    }   
}

module.exports = nextConfig
