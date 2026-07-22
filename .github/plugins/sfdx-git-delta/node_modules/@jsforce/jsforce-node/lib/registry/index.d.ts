import type { Registry } from './types';
import { FileRegistry } from './file';
import { SfdxRegistry } from './sfdx';
import { EmptyRegistry } from './empty';
declare let registry: Registry;
export default registry;
export type { Registry };
export { FileRegistry, SfdxRegistry, EmptyRegistry };
