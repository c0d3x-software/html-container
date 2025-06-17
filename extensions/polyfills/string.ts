/// <reference lib='dom' />
/// <reference lib='esnext' />

import { pd } from "pretty-data";

declare global {
   interface FindResult {
      index: number
      found: string
      first: string
      parts: string[]
   }

   interface String {
      find(regex: RegExp): FindResult | undefined
      findAll(regex: RegExp): FindResult[]
      decodeHTML(pretty: boolean): string
   }
}

String.prototype.find = function (regex) {
   const content = this as string
   const returns = content.match(regex)

   if (!returns) return undefined

   const index = returns.index || 0
   const found = returns[0]
   const first = returns[1]
   const parts = returns

   return { index, found, parts, first }
}

String.prototype.findAll = function (regex) {
   const results: FindResult[] = []
   const content = this as string

   for (const item of content.matchAll(regex)) {
      const index = item.index
      const found = item[0]
      const first = item[1]
      const parts = item

      results.push({ index, found, first, parts })
   }

   return results
}

String.prototype.decodeHTML = function (pretty) {
   const regex = /&quot;|&amp;|&lt;|&gt;|&apos;/g
   const mapping = {
      '&quot;': '"', '&amp;': '&',
      '&lt;': '<', '&gt;': '>', '&apos;': "'"
   }

   const that = this.replace(regex, m => mapping[m]);

   return pretty ? pd.xml(that) : that
}


export { }