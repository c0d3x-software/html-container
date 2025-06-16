import { readFile } from "fs/promises"

export async function interpolateHTML(html: string) {
   const EMBED_HTML_RGX = /<embed\s+src=['"](.+\.html)['"][^\/]+?\/>/gmi
   const embedHTML = html.findAll(EMBED_HTML_RGX)
  
   for (const item of embedHTML) {
      try {
         const text = item.first.startsWith('http')
            ? await fetch(item.first).then(x => x.text())
            : await readFile(item.first, 'utf-8')

         html = html.replace(item.found, text)
      }
      finally { }
   }

   return html
}