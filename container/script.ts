import { VDOM } from './shared'
import { gzipSync } from "zlib";

export function scriptfy(html: string, vdom: VDOM, data: object) {
   const vDOM = { ...vdom }
   const that = { ...data }
   delete vDOM['body']

   // remove outerHTML information from vdom
   Object.keys(vDOM).forEach(k => delete (vDOM as any)[k]['outer'])

   // remove component information from self
   Object.keys(that)
      .filter(k => typeof that[k] == 'function')
      .forEach(k => delete that[k])

   const binding = `
      const data = ${serialize(that)};
      const vdom = ${serialize(vDOM)};
      globalThis.self = new Proxy(data, {
         get(refer,field) { return refer[field] },
         set(refer,field,value) {
            refer[field]=value;
            
            const items = Object.entries(vdom)
               .filter(([k,v]) => v.binds
                  .some(x => x.includes('self.' + field)));

            if (!items?.length) return true;

            for (const [path, data] of items) {
               const node = document.querySelector(path);
               if (!node) continue;
               for (const bind of data.binds) {
                  const full = data.inner;
                  const text = node.innerText;
                  const done = full.replace(bind, value);
                  node.innerText = done;
               }
            }
               
            return true;
         }
      })`
   
   const script = `
      const ___ = '${gzipSync(binding).toString("base64")}';

      const decompressFromString = b => 
         new Response(new Blob([Uint8Array.from(atob(b),
            c => c.charCodeAt(0))]).stream()
               .pipeThrough(new DecompressionStream('gzip')))
                  .text();
      
      decompressFromString(___).then(eval);`

   const minified = script
      .replaceAll('\n', ' ')
      .replaceAll('\t', ' ')
      .replaceAll('  ', '')
      .trim()
   
   return `${html}\n<script>${minified}</script>`
}

function serialize(value: object) {
   const seen = new WeakSet();

   function _serialize(val) {
      if (val === null) return "null";
      if (typeof val === "string") return JSON.stringify(val);
      if (typeof val === "number" || typeof val === "boolean") return String(val);
      if (typeof val === "undefined") return "undefined";
      if (typeof val === "bigint") return `${val}n`;
      if (typeof val === "symbol") return val.toString();
      if (typeof val === "function") return val.toString();
      if (val instanceof Date) return `new Date(${JSON.stringify(val.toISOString())})`;
      if (val instanceof RegExp) return val.toString();
      if (Array.isArray(val)) return `[${val.map(_serialize).join(", ")}]`;
      if (val instanceof Set) return `new Set(${_serialize([...val])})`;
      if (val instanceof Map) return `new Map(${_serialize([...val.entries()])})`;

      if (typeof val === "object") {
         if (seen.has(val)) return '"[Circular]"';
         seen.add(val);

         const props = Object.entries(val).map(([k, v]) => `${JSON.stringify(k)}: ${_serialize(v)}`);
         return `{${props.join(", ")}}`;
      }

      return "undefined"; // fallback
   }

   return _serialize(value);
}