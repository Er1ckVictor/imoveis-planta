/**
 * Prefixa caminhos de arquivos de /public com o basePath.
 * No GitHub Pages o site fica em /nome-do-repositorio, então "/assets/x.jpg" vira "/nome-do-repositorio/assets/x.jpg".
 */
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');
export const asset = (path: string) => `${basePath}${path}`;
