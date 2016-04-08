export default (name) => {
  return `
{
  "presets": [
    "es2015",
    "stage-1"
  ],
  "plugins": [
    "transform-runtime",
    "transform-decorators-legacy"
  ]
}
  `.substr(1).trim();
};
