const nextConfig = {
  reactCompiler: false,
  images:{
    remotePatterns:[
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      }
    ]
  }
};

export default nextConfig;
