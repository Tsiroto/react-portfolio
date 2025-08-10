import "@mui/material/styles";

declare module "@mui/material/styles" {
    interface Palette {
        accent: Palette["primary"];
        glow: { main: string };
    }
    interface PaletteOptions {
        accent?: PaletteOptions["primary"];
        glow?: { main: string };
    }
}

// ---- (Optional) Typography augmentation example ----
// Uncomment if you later add custom variants and want them typed everywhere.
// declare module "@mui/material/styles" {
//   interface TypographyVariants {
//     hero: React.CSSProperties;
//   }
//   interface TypographyVariantsOptions {
//     hero?: React.CSSProperties;
//   }
// }
// // Allow using the new variant in <Typography variant="hero" />
// declare module "@mui/material/Typography" {
//   interface TypographyPropsVariantOverrides {
//     hero: true;
//   }
// }
