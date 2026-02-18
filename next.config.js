module.exports = {
  webpack: (cfg, { isServer }) => {
    if (isServer) {
      cfg.externals = cfg.externals || [];
      cfg.externals.push({
        sharp: "commonjs sharp",
      });
    }
    
    return cfg;
  },
};
