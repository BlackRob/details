module.exports = {
  webpack: (cfg) => {
    // 1. KEEP your existing rules for Markdown and Fonts
    cfg.module.rules.push(
      {
        test: /\.md$/,
        loader: "frontmatter-markdown-loader",
        options: { mode: ["react-component"] },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"],
      },
    );

    // 2. ADD this line to fix the Next.js 12 hanging bug
    cfg.cache = false;

    return cfg;
  },
};
