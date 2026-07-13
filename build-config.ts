import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-modal",
    path: "./web-component/lib/jb-modal.ts",
    outputPath: "./web-component/dist/jb-modal.js",
    tsConfigPath: "./web-component/tsconfig.json",
    umdName: "JBModal",
    external:["jb-core", "jb-core/theme", "jb-core/i18n"],
    globals:{
      "jb-core":"JBCore",
      "jb-core/theme":"JBCoreTheme",
      "jb-core/i18n":"JBCoreI18N"
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
