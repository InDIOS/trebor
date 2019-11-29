import { builtin, browser, node as nodejs, amd } from 'globals';

const allBuildins: string[] = [builtin, browser, nodejs, amd].reduce((result, build) => {
  return result.concat(Object.keys(build));
}, []);

export const buildins = [...new Set(allBuildins)];

export function isBuildIn(varName: string) {
  return varName !== 'name' && buildins.includes(varName);
}
