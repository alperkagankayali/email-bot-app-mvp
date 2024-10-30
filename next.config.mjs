import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: [
        "email-bot-app-mvp-mx28.vercel.app",
        "email-bot-app-mvp.vercel.app",
        "email-bot-app-mvp-evt8.vercel.app",
      ],
    },
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!https://upload.wikimedia.org/
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "upload.wikimedia.org",
      "test-bucket-emails-577638362157.s3.eu-north-1.amazonaws.com",
    ],
  },
  async headers() {
    return [
      {
        source: '/api/user/get-csv-format',
        headers: [
          {
            key: "Content-Type",
            value: 'text/csv',
          },
          {
            key: "Content-disposition",
            value: 'attachment; filename=userlist.csv',
          },
        ],
      },
      
    ]
  },
};

export default withNextIntl(nextConfig);
