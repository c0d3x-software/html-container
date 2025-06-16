import { interpolateHTML } from './merger'
import { VDOM, tryEval } from "./shared"
import { DOM } from "../commander"

const removeTemplateTag = (html: string) => html
   .replace(/<template[^>]+?>/, '')
   .replace(/<\/template\s*>/, '')
   .replace(/<!--[^-]+-->/, '')

export async function virtualizeDOM(html: string) {
   const root = removeTemplateTag(html)
   const wrap = `<html><head></head><body>${root}</body></html>`
   const body = (await DOM.intantiate(wrap)).document.body

   return createVDom(body)
}

export async function interpolate(html: string, that: object, vdom: VDOM): Promise<string> {
   (globalThis as any)['self'] = that;
   html = removeTemplateTag(html)

   const clean = (bind: string) => bind.replace(/^\$\{|\}$/g, '').trim()
   const evaluate = (bind: string) => tryEval(clean(bind))?.toString() || ''
   const interpolate = (html: string, bind: string) => html.replace(bind, evaluate(bind))
     
   const newHTML = Object
      .values(vdom)
      .flatMap(x => x.binds)
      .reduce(interpolate, html)
   
   return await interpolateHTML(newHTML)
}

function createVDom(node: HTMLElement, path = '', paths = {}): VDOM {
   if (node.nodeType !== 1) return paths

   const tag = node.tagName.toLowerCase()
   const siblings = Array.from(node.parentNode?.children || [])
   const sameTagSiblings = siblings.filter(n => n.tagName === node.tagName)
   const index = sameTagSiblings.indexOf(node) + 1
   const pathSegment = sameTagSiblings.length > 1
      ? `${tag}:nth-of-type(${index})`
      : tag
   
   path = path ? `${path} > ${pathSegment}` : pathSegment

   const props = Array.from(node.attributes)
      .filter(attr => !!attr.value && !!attr.name)
      .reduce((data, attr) => data[attr.name] = attr.value && data, {})

   let match = undefined as any

   const inner = innerTextFromHTML(node.innerHTML)
   const outer = node.outerHTML
   const binds = [] as string[] // ${...}
   const regex = /(\$\{[^}]+\})/g

    while ((match = regex.exec(inner)) !== null) 
      binds.push(match[1].trim())

   paths[path] = { inner, outer, props, binds }

   Array.from(node.children)
      .map(x => x as HTMLElement)
      .forEach(child => createVDom(child, path, paths))
   
   return paths
}
 
function innerTextFromHTML(html) {
   html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
   html = html.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');
   html = html.replace(/<br\s*\/?>/gi, '\n');
   html = html.replace(/<\/p>/gi, '\n');
   html = html.replace(/<[^>]+>/g, '');
   html = html
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
   
   return html.replace(/[ \t]+\n/g, '\n').replace(/\n{2,}/g, '\n').trim();
}
 