type FileStringModules = {
    readonly default: string;
}
declare module '*.css' {
    const value: FileStringModules;
    export default value;
}
declare module '*.svg' {
    const value: string;
    export default value;
}