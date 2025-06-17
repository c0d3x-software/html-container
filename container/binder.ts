import { interpolateHTML } from './merger'
import { VARG, VDOM, tryEval, tryParse } from "./shared"
import { DOM } from "../commander"
import '../extensions/polyfills'

const removeTemplateTag = (html: string) => html
   .replace(/<template[^>]+?>/, '')
   .replace(/<\/template\s*>/, '')
   .replace(/<!--[^-]+-->/, '')

const HEAD_ELEMENT_RGX = /<(\w+) .+?>/g

function markTypedAttribute(root: string) {
   for (const attributes of root.findAll(HEAD_ELEMENT_RGX)) {
      const [all, tag] = attributes.parts
      
      for (const part of all.findAll(/ (\w+?=[\w\.]+?)[ >]/g)) {
         const [_, attr] = part.parts
         const get = attr.split('=')[1]         
         const set = all.replace(`=${get}`, `="\$\{ ${get} \}"`)

         root = root.replace(all, set)
      }
   }

   return root
}

export async function virtualizeDOM(html: string) {
   const root = removeTemplateTag(html)
   const newt = markTypedAttribute(root)
   const wrap = `<html><head></head><body>${newt}</body></html>`
   const body = (await DOM.intantiate(wrap)).document.body
   const vdom = createVDom(body)

   return vdom
}

export async function interpolate(html: string, that: object, vdom: VDOM): Promise<string> {
   (globalThis as any)['self'] = that;
   html = markTypedAttribute(removeTemplateTag(html))

   const clean = (bind: string) => bind.replace(/^\$\{|\}$/g, '').trim()   
   const evaluate = (bind: string) => tryEval(clean(bind))?.toString() || ''  
   const interpolate = (html: string, bind: string) =>
      html.replace(bind, evaluate(bind))
   
   function setAttribute(html: string, varg: VARG) {
      const bound = tryEval(clean(varg.value))
      const isObj = typeof bound == 'object'
      const style = varg.field == 'style'      
      const value = style && isObj ? styleToCss(bound)
         : isObj == false ? bound.toString()         
         : 'undefined'
      
      if (value == 'undefined')
         console.warn('trying to set a non-style attribute to an object')
      
      const refer = varg.refer.replace(varg.value, value)
      
      return html.replace(varg.refer, refer)
   }
     
   const newHTML = Object
      .values(vdom)
      .flatMap(x => x.binds)
      .reduce(interpolate, html)
   
   const nowHTML = Object
      .values(vdom)
      .flatMap(x => x.attrs)
      .reduce(setAttribute, newHTML)
   
   return await interpolateHTML(nowHTML)
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
   const attrs = getAttributesVDOM(node.outerHTML)
   const binds = [] as string[] // ${...}
   const regex = /(\$\{[^}]+\})/g

    while ((match = regex.exec(inner)) !== null) 
      binds.push(match[1].trim())

   paths[path] = { inner, props, binds, attrs }

   Array.from(node.children)
      .map(x => x as HTMLElement)
      .forEach(child => createVDom(child, path, paths))
   
   delete paths['body']   

   Object.entries(paths as object)
      .filter(([k, v]) => v.binds.length == 0)
      .filter(([k, v]) => v.attrs.length == 0)
      .forEach(([k, v]) => delete paths[k])

   return paths
}

function getAttributesVDOM(element: string): VARG[] {
   const vATTRS = [] as VARG[]
   const rATTRS = / (\w+?)="(\$\{.+?\})"/g

   const header = element.find(HEAD_ELEMENT_RGX)
   if (header == undefined) return vATTRS

   for (const found of header.found.findAll(rATTRS)) {
      const [refer, field, value] = found.parts
      vATTRS.push({ field, value, refer })
   }   

   return vATTRS
}

function styleToCss(style: object) {
   const noUnit = ['zIndex', 'opacity', 'fontWeight', 'lineHeight'];

   function entry([k, v]) {
      const field = k.replace(/([A-Z])/g, '-$1').toLowerCase()
      const value = typeof v === 'number' && !noUnit.includes(k) ? v + 'px' : v
      return `${field}:${value}`
   }

   return Object.entries(style).map(entry).join(';') + ';';
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
 