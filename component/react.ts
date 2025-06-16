import { renderToString } from "react-dom/server"
import { Render, ParseInfo } from "./shared";
import { getProps } from "../container";
import '../polyfills'

export const reactRender: Render = (html: string, self: object) => {
   const replacer = (html, ref: { text: string, jsx: string}) =>
      html.replace(ref.text, ref.jsx)
   
   const parseds = parseJSX(html, self) 
   
   const rendereds = parseds
      .map(x => ({ ...x, jsx: self[x.tag] }))
      .filter(x => !!x.jsx)
      .map(x => ({ ...x, jsx: x.jsx(x.props) }))
      .map(x => ({ ...x, jsx: renderToString(x.jsx) }))

   const replaced = rendereds
      .reduce(replacer, html)
      .replaceAll('<!-- -->', '')

   return Promise.resolve(replaced)
}

const SELF_CLOSED_JSX_RGX = /<([A-Z]+?\w+)([^\/]+?)\/>/gm
const JSX_RGX = /<([A-Z]+?\w+)([^>]*?)>([^<]*?)<\/[A-Z]+?[^>]+?>/gm

function parseJSX(html: string, data: object): ParseInfo[] {
   if (!html || !html?.includes('<')) return []

   const getJSX = x => <ParseInfo>({
      props: getProps(data, x.parts[2], x.parts[3]),
      text: x.found,
      tag: x.first
   })

   const selfClosedJsxs = html.findAll(SELF_CLOSED_JSX_RGX).map(getJSX)
   const jsxWithChildren = html.findAll(JSX_RGX).map(getJSX) 

   return selfClosedJsxs.concat(jsxWithChildren)
}