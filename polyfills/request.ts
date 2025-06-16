/// <reference lib='dom' />
/// <reference lib='esnext' />

import { tryParse } from "../container"

declare global {
   interface Route {
      static: boolean
      routed: string
      params: Record<string, any>
   }

   interface Request {
      route: string
      match(route: string): Route
      resolve(route: string): Request
   }
}

Request.prototype.resolve = function (route: string) {
   const match = this.match(route) || {}   
   
   if (match.static) return this

   const baseURL = this.url.replace(this.route, '')
   const query = new URLSearchParams(match.params).toString()
   
   return new Request(baseURL + match.routed + '?' + query)
}

Request.prototype.match = function (route: string) {
   const routeParts = route.split('/').filter(Boolean)
   const pathParts = this.route.split('/').filter(Boolean)
   const defaulted = { routed: route, params: {}, static: true }

   if (routeParts.length !== pathParts.length) return defaulted

   const params: Record<string, any> = {}
   const parts: string[] = []

   for (let i = 0; i < routeParts.length; i++) {
      const rPart = routeParts[i]
      const pPart = pathParts[i]
      const isVar = rPart.startsWith(':')

      if (isVar) params[rPart.slice(1)] = tryParse(pPart) || pPart     
      else if (rPart !== pPart) return defaulted
      else parts.push(rPart)
   }

   const stat1c = Object.keys(params).length == 0
   const routed = '/' + parts.join('/');

   return { routed, params, static: stat1c }; 
}

Object.defineProperty(Request.prototype, 'route', {
   get() { return new URL(this.url).pathname },
   configurable: true,
   enumerable: false
});
 


export { }