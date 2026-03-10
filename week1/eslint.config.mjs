import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended, 
    {
        rules: {
            // Specifieke fix voor Express 'next' en ongebruikte test-imports
            "no-unused-vars": ["warn", { 
                "argsIgnorePattern": "^_",            // Negeer argumenten die starten met _
                "varsIgnorePattern": "^ExpectationFailed$", // Negeer deze specifieke import
                "args": "after-used"                  // Alleen klagen als ongebruikte args VOOR gebruikte args staan
            }],
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.jest,
                ...globals.express
            },
        },
        

    },
    {
        files: ["**/*.js"],
        languageOptions:{
            sourceType: "commonjs"
        }
    }
];