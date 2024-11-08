import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

esbuild
  .build({
    entryPoints: ["server.ts"],
    bundle: true,
    outfile: "dist/server.js",
    platform: "node",
    format: "esm",
    plugins: [nodeExternalsPlugin()],
  })
  .catch(() => process.exit(1));
