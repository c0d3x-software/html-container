# HTML container

A micro-lib for agnostic page container architecture to mitigate over-componentization, monolith component tree and simplistic microfrontend.

* microfrontend
* microcomponents

## Installation

```
$ npm i html-container
$ bun add html-container
```

## Micro-frontends

HTML container supports easy mifro-frontent using web standard slots with extended features, wnabling an agnostic, low code and easy-to-use microfrontend platform.

### Full stack support

Client-sider support with script loading and parser to server-side rendering.

<aside cols='2'>

```html
<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <title>HTML Container</title>   
   <script src='html+.min.js'></script>
</head>
<body>etc...</body>
</html>
```

```ts
'use server'

import { parser } from 'html-container'

export function parseHtmlPlus(html: string) {
   return await parser(html).build('/build')
}
```

</aside>

### Sloting, routing and fallbacks

HTML+ slot supports merged frontends withwith loading content as fallback. It supports declarative static and dynamic routes.

```html
<body>
   <slot src='http://app.vue.com'>loading...</slot>
   <slot route='/' src='http://app.react.com'>loading...</slot>   
   <slot route='/user/:id' src='http://app.angular.com'>loading...</slot>
</body>
```

### Renderig federate component

An exposed default component could be reder by slot in client-side.

```html
<slot type='jsx' src='http://app.react.com/assets/hello.js'>loading...</slot>
```

### Metatags reallocation

All metatag and head content in slot is dynamically allocated to html page. But the SEO only impacted with this metatag reallocated in server by server-side html-container.


## Micro-components architecture

HTML container enables a server-side only micro-component architecture that breaks monolith component in smaller components by HTML+ template containers. 

### Inner slots

Slot is also supported within HTML+ templates.

<aside cols='2'>

```html
<template route='/admin' src='index.ts'>
   <slot src='./layouts/header.html'>loading...</slot>
   <slot src='http://external.html'>loading...</slot>
</template>
```

### Template container

JSX-in-HTML with interpolation, literal attributes with self as container context.

<aside cols='2' >

```html
<template type='jsx' src='index.ts'>
   <h1>${ self.title }</h1> 
   <Hello number=1 string='' object={}
      boolean=true array=[] refer=self.obj />
</template>
```

```ts
export { Hello } from '../components'
export const title: string = 'title'
export const obj = 'reference...'
const notVisibleInTemplate = 'private'
```

</aside>


### Two Way Data binding 

Two way data binding with micro virtual DOM with self object and interpolated values.

```html
<template type='tsx' src='index.ts'>
   <h1>${ self.title }</h1>
   <input onchange='self.title=event.target.value' />
</template>
```

### Module federation

You could federate your component, with zero configuration, just placing all exported component in the assets ou public folder (file server) and importing it by HTML+ template.

```html
<template type='tsx' src='http://sample.com/assets/components.js'>
   <h1>${ self.title }</h1>
   <ItWorks />
   <Hello >
   <Hi />
</template>
```

### Server-side parser

HTML+ template containers are rendered in server-side only with minimal partial hydration for its two-way data binding injected in HTML. It could be use with any react meta framework as next.js, gatsby, astro, remix, fresh, and so on.

```ts
import { parser } from 'html-container'

const basicHTML = /* the initial HTML with root element */
const routeHtml = /* current routed template page */

return await parser("#root")
   .template(basicHTML, routeHtml)
   .generate('routes/') // routing page folder
```

