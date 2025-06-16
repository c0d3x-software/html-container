import path from 'path';
import { JSDOM } from 'jsdom'
import { HTML } from "./shared"
import { pd } from 'pretty-data'
import * as container from '../container'

declare class JSDOM {
   constructor(htmlString: string)
   window: { document: HTMLDocument }
}

export const isNotTemplate = innerHTML =>
   !innerHTML.trim().startsWith('<template')

export const renderComponents = async (render, template, context) =>
   render ? await render(template, context) : template

export const importScript = async (html: string, base: string) => {
   const resolver = x => path.resolve(base, x)
   const importer = async x => await import(resolver(x))

   const result = await html?.trim().split('\n').slice(0, 1)
      .map(x => x.match(/src=['"]([^'"]+)['"]/))
      .map(x => x ? importer(x[1]) : {})
      .at(0) || {}
   
   return result
}

export const buildTemplate = async (html: string, data: object, vdom: container.VDOM) =>
   await container.interpolate(html, data, vdom)

export function getElements(html: string, query: string): HTML {
   const HTML = new JSDOM(html).window.document
   const root = HTML.querySelector(query) as HTMLElement

   if (!root) throw 'component-page: not found element in outer HTML'
      + ` with query root '${query}'`

   return { root, head: HTML.head, body: HTML.body }
}

export function mountingHTML(html: HTML) {
   html = metatagTransfers(html)
   
   const head = html.head.outerHTML
   const body = html.body.outerHTML

   return pd.xml(`<html>${head}${body}</html>`)
}

export function metatagTransfers(html: HTML) {
   const title = html.body.querySelector('title')?.outerHTML ?? ''

   if (title) html.head.innerHTML = html.head
      .innerHTML.replace(/<title>\w+?<\/title>/, '')
   
   html.head.innerHTML += title
   html.body.innerHTML = html.body.innerHTML.replace(title, '')

   
   for (const meta of html.body.querySelectorAll('meta')) {
      html.head.innerHTML += meta.outerHTML
      html.body.innerHTML = html.body.innerHTML.replace(meta.outerHTML, '')
   }

   return html
}