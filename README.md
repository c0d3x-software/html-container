<style> code * { font-style: normal !important; } </style>

# HTML container

A micro-lib for agnostic page container architecture to mitigate over-componentization, monolith component tree and simplistic microfrontend.

## Installation

```
$ npm i container-page
$ bun add container-page
```

All resources are global, all is enable with global import.

```ts
import 'container-api' // loading all features
```

## Conception

Page component enables incremental components using low code HTML extensions to preserve a more web standard design, replacing component pages role. 

<img src='assets/container-page.png'>


## HTML+ template

HTML template is inner HTML with small extension to support JSX embedment. Script code behind is called by template, consuming its export members.

<aside cols='4:5' >

```html
<template src='index.ts'>
   <h1>${ self.title }</h1> 
   <Hello name='world '/>
</template>
```

```ts
// code-behind index.ts in JSX
export { Hello } from '../components'
export const title: string = 'title'
const notVisibleInTemplate = 'private'
```

</aside>

## MetaTag transfers

All metatags inside a template is realocated into HTML head.

<aside cols='3:5'>

```html
<template>
   <title>Title</title>
   <h1>Subtitle</h1>
</template>
```

```html
<html>
   <head><title>Title</title></head>
   <body><h1>Subtitle</h1></body>
</html>
```

</aside>

## Data interpolation

For interpoaltion, HTML+ uses just vanilla interpolation syntax.

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

## Semantic attributes

Attributes with literals values and refererences works like in javascript.

```html
<template src='index.ts'>
   <Sample number=1 string='' boolean=true 
      object={} array=[] reference=self.variable />
</template>
```

It supports shorthands property name

## Two Way Data binding 

Self field changes updates interpolated values using a micro vdom .

```html
<template src='index.ts'>
   <h1>${ self.title }</h1>

   <!-- this will trigger the container render -->
   <input onchange='self.title=event.target.value' />

   <!-- this will not trigger the container render -->
   <input onchange='self.subtitle=event.target.value' />
</template>
```