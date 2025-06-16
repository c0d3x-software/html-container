import { expect, test } from "bun:test";
import { importScript } from "./mount";

test('import script', async function () {
   const html = 'src="./mount.ts"'
   const test = await importScript(html, 'parser')
   // expect(typeof test['importScript']).toBe('function')
})