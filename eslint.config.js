import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // eslint-config-nextのデフォルト無視設定をオーバーライドします。
  globalIgnores([
    // eslint-config-nextのデフォルト無視設定：
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
