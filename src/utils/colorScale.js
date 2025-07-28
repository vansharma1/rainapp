export function getRainColor(intensity) {
  switch (intensity) {
    case "light":
      return "#00bfff";
    case "moderate":
      return "#007fff";
    case "heavy":
      return "#003f7f";
    default:
      return "transparent";
  }
}
