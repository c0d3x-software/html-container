# HTML container

A micro-lib for agnostic page container architecture to mitigate over-componentization, monolith component tree and simplistic microfrontend.

* microfrontend
* microcomponents

## Installation

```
$ npm i container-page
$ bun add container-page
```

All resources are global, all is enable with global import.

```ts
import 'container-api' // loading all features
```

## Introduction

<img src='assets/container-page.png'><br>

HTML container allows a simple routed page with HTML+ low abstraction, that supoort components to be injected within HTML.

* **HTML template**: HTML+ for component-in-HTML
* **MetaTag transfer**: move metatags to head for SEO
* **Data interpolation**: support basic data interpolation
* **HTML merging**: HTML inclusion with `embed[src]`
* **Typed attributes**: Components typed props using js syntax
* **Two-Way data binding**: two-way data binding + lite vDom
* **Vanilla routing**: request polyffils for dynamic route


## HTML+ template

HTML+ is API specification for small HTML extension to component-in-HTML. in template[src] is called a script that exports the template resources.

<aside cols='4:5' >

```html
<template src='index.ts'>
   <h1>${ self.title }</h1> 
   <Hello name='world'/>
</template>
```

```ts
export { Hello } from '../components'
export const title: string = 'title'
const notVisibleInTemplate = 'private'
```

</aside>

## MetaTag transfers

All metatags inside a template is transfered to HTML head.

<aside cols='3:5'>

```html
<template><title>Title</title><h1>Subtitle</h1></template>
```

```html
<html>
   <head><title>Title</title></head>
   <body><h1>Subtitle</h1></body>
</html>
```

</aside>

## Data interpolation

HTML+ supports data interpolation with template string syntax.

```html
<template src='index.ts'>
   <h1>${ self.title }</h1> 
   <h2>${ self.subtitle }</h2>
</template>
```

## HTML merging

HTML merged using embed[src] for html, useful for microfrontend gateway.

<aside cols='2'>

```html
<template src='index.ts'>
   <embed src='./layouts/header.html' />
   <embed src='http://external.html' />
</template>
```

</aside>

## Typed attributes

Javascript syntax in component attributes, allowing typed props.

```html
<template src='index.ts'>
   <Hello number=1 string='' 
      boolean=true object={} 
      array=[] refer=self.obj />
</template>
```

## Two Way Data binding 

Basic two way data binding with self object for interpolation values.

```html
<template src='index.ts'>
   <h1>${ self.title }</h1>
   <input onchange='self.title=event.target.value' />
</template>
```

## Vanilla routing

Request polyfills to match dynamic route params from url.

```ts
const pattern = '/route/subroute/:id/:ok/:hi'
const routing = 'http://ok.com/route/subroute/1/true/hello'
const matched = new Request(routing).match(pattern)
const request =  new Request(routing).resolve(pattern)

// matched.params = { id: 1, ok: true, hi: 'hello' }
// request.route = /route/subroute&id=1&ok=true&hi=hello
```

## CSS component

CSS-only components supported with functions for easy componentization. After transpiled the arguments, it works just pure CSS in HTML (`experimental`).

```css
grid(cols) { 
   display: grid;
   grid-template-columns: ${cols}; 
}
```

```html
<template css='./styles.css'>
   <div style='display:grid; grid-template-columns:1fr 1fr'>...</div>
   <grid cols='1fr 1fr'>...</grid> <!-- css component alternative -->
</template>
```

## Inspiration

Here some motivation and explationations to what is html-container, how it works and what kind of problem it resolves.

## Proposal

The proposal is not replaces the component itself, but avoid unnecessary componentization, since component overfits the page concept itself.

The html-container lib defines a HTML+ specification with some HTML enhancements that allows to inject component directally inside HTML+, and also another essential features for a routed page, but not overlaps components.

## Conception

Page components are component-based lib constrains, that demands full componentization. However, component reusability conflits with page singularity, overfitting pages with useless overhead (like props, etc).

The html-container is a web-standard approach for incremental components in a agnostc lib for component-in-HTML (JSX by default) that splits monolithic trees into smaller ones, reducing bundle size, render time and design overhead.

Ccomponents are reserved for its original reusability purpose, meanwhile page containers serves chumks of HTML+ as HTML container for components.

## Integration

This library could be use in any component-based frontent within a server-side render framework. The host framework is the **commander** that will handles the routing and uses library to render the HTML+ templates.

```ts
import { parser } from 'html-container'

const basicHTML = /* the initial HTML with root element */
const routeHtml = /* current routed template page */

return await parser("#root")
   .template(basicHTML, routeHtml)
   .generate('routes/') // folder of routing pages
```

The lib comes with reactParser by default, but is supports custom parsers to handle with any component-based libraries. 

```ts
const anotherRender: Render = (html: string, self: object): string
```

The html is the full template HTML with self object with all the exported content from script related to `template[src]`. 

The custom parser needs to follow these steps:

* extract components in html string based on self exporteds components
* extract each props in each component by its typed props syntax
* render each component string by its library, dynamically
* inject the rendered component in HTML ocurrence
* return the html with those changes

**Obs.: native supports to Angular, vue and lit in future.**