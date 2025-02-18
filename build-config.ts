import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-modal",
    path: "./lib/JBModal.ts",
    outputPath: "./dist/JBModal.js",
    umdName: "JBModal",
    external:["jb-core"],
    globals:{
      "jb-core":"JBCore"
    }
  },
];
export const reactComponentList: ReactComponentBuildConfig[] = [
  {
    name: "jb-modal-react",
    path: "./react/lib/JBModal.tsx",
    outputPath: "./react/dist/JBModal.js",
    external: ["jb-modal", "prop-types", "react","jb-core", "jb-core/react"],
    globals: {
      react: "React",
      "prop-types": "PropTypes",
      "jb-core": "JBCore",
      "jb-core/react": "JBCoreReact",
    },
    umdName: "JBModalReact",
    dir: "./react"
  },
];