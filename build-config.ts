import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-modal",
    path: "./lib/jb-modal.ts",
    outputPath: "./dist/jb-modal.js",
    umdName: "JBModal",
    external:["jb-core", "jb-core/theme"],
    globals:{
      "jb-core":"JBCore",
      "jb-core/theme":"JBCoreTheme"
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
      "jb-modal":"JBModal",
      "prop-types": "PropTypes",
      "jb-core": "JBCore",
      "jb-core/react": "JBCoreReact",
    },
    umdName: "JBModalReact",
    dir: "./react"
  },
];