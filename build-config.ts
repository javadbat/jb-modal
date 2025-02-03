import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-modal",
    path: "./lib/JBModal.ts",
    outputPath: "./dist/JBModal.js",
    umdName: "JBModal",
  },
];
export const reactComponentList: ReactComponentBuildConfig[] = [
  {
    name: "jb-modal-react",
    path: "./react/lib/JBModal.tsx",
    outputPath: "./react/dist/JBModal.js",
    external: ["jb-modal", "prop-types", "react"],
    globals: {
      react: "React",
      "prop-types": "PropTypes",
    },
    umdName: "JBModalReact",
    dir: "./react"
  },
];