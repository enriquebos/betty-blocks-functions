declare module "../utils/templayed" {
  const templayed: (template: string) => (vars: any) => string;
  export default templayed;
}
