import { reactRender, Render } from "../component";
import { HTMLString } from "./shared";
import * as mounter from "./mount";
import { scriptfy, virtualizeDOM } from "../container";

export function parser()
export function parser(rootQuery: string)
export function parser(rootQuery = '#root') {
   const context = {
      render: reactRender,
      inner: '',
      outer: '',
   }

   return {
      configure(componentRender: Render) {
         context.render = componentRender
         return { template: this.template }
      },

      template<T extends string=HTMLString>(outer: T, inner: T) {
         context.inner = inner
         context.outer = outer
         return { generate: this.generate }
      },

      async generate(directory: string) {
         if (mounter.isNotTemplate(context.inner))
            return context.outer

         const { inner, outer, render } = context
         
         const bindings = await virtualizeDOM(inner)
         const document = await mounter.getElements(outer, rootQuery) 
         const resource = await mounter.importScript(inner, directory)
         const template = await mounter.buildTemplate(inner, resource, bindings)
         const rendered = await mounter.renderComponents(render, template, resource)
         const scripted = await scriptfy(rendered, bindings, resource)

         document.root.innerHTML = scripted
         document.root.outerHTML = document.root.innerHTML
         
         return mounter.mountingHTML(document)
      }
   }
}