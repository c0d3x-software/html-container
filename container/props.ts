import { AttributeInfo, tryEval, tryParse } from "./shared"
import '../extensions/polyfills'

const SELF_CLOSED_JSX_RGX = /<([A-Z]+?\w+)([^\/]+?)\/>/gm
const JSX_RGX = /<([A-Z]+?\w+)([^>]*?)>([^<]*?)<\/[A-Z]+?[^>]+?>/gm

export function getProps(self: object, attributes: string, children?: string): object {
   const hasChildrenSubComponent = children
      && children.find(SELF_CLOSED_JSX_RGX)
      || children?.find(JSX_RGX)

   if (hasChildrenSubComponent)
      `container-page: A html container template does not support inner components. `
         + `Use only self-closed component within container templates or `
         + `component children with no component inside.`
   
   return extract(attributes + ' ').reduce(setProps(self), { }) 
}

const setProps = self => (that: object, { type, name, data }: AttributeInfo) => {
   const selfData = Object.get(self, data)

   that[name] = selfData ? selfData
      : type == 'string' ? tryEval(data)
      : type == 'number' ? JSON.parse(data)
      : type == 'boolean' ? JSON.parse(data)
      : type == 'object' ? tryParse(data) || tryEval(data) || {}
      : type == 'array' ? tryParse(data) || tryEval(data) || []
      : undefined
      
   return that
}
   
      
function extract(attrs: string): AttributeInfo[] {
   if (!attrs?.trim()) return []

   const ARRAY_ATTR_RGX = /(\w+)=(\[[^\}]+?\])/
   const OBJECT_ATTR_RGX = /(\w+)=(\{[^\}]+?\})/
   const STRING_QUOTE_ATTR_RGX = /(\w+)=(["][^"]+?["])/
   const STRING_SIMPLE_ATTR_RGX = /(\w+)=(['][^']+?['])/
   const NUMBER_ATTR_RGX = /(\w+)=(\d+?)[ \/>]/
   const BOOL_ATTR_RGX = /(\w+)=(true|false)[ \/>]/
   const REF_ATTR_RGX = /(\w+)=([a-zA-Z]+[\.a-zA-Z0-9]*)[ \/>]/
   const NOT_ATTR_RGX = / (\w+)=(.+)[ \/>]/
   const OR_ATTR_RGX = / (\w+)[ \/>]/
   
   const pipeline = [
      { type: 'array', regex: ARRAY_ATTR_RGX },
      { type: 'object', regex: OBJECT_ATTR_RGX },
      { type: 'string', regex: STRING_SIMPLE_ATTR_RGX },
      { type: 'string', regex: STRING_QUOTE_ATTR_RGX },
      { type: 'number', regex: NUMBER_ATTR_RGX },
      { type: 'number', regex: NUMBER_ATTR_RGX },
      { type: 'boolean', regex: BOOL_ATTR_RGX },
      { type: 'reference', regex: REF_ATTR_RGX },
      { type: 'other', regex: NOT_ATTR_RGX },
      { type: 'flag', regex: OR_ATTR_RGX },
   ]

   let resulted = undefined as any
   const result = [] as AttributeInfo[]

   for (const item of pipeline) {
      while ((resulted = attrs.match(item.regex))) {         
         const [full, name, d] = resulted
      
         if (!full) continue
      
         attrs = attrs.replace(full, '').replace(/<\w+/, '')      
         const data = item.type == 'flag' ? 'true' : d
         result.push({ name, data, type: item.type })
      }
   }

   return result.concat(extract(attrs))
}