// eslint.config.mjs
import js from "@eslint/js";
import next from "eslint-config-next";

const eslintConfig = [
  js.configs.recommended, // or [] if you want literally nothing
  ...next(["core-web-vitals", "typescript"]),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // 🚫 disable all lint rules
      "no-unused-vars": "off",
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/react-in-jsx-scope": "off",
      // Add more here if needed
    },
  },
];

export default eslintConfig;

