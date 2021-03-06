# html-to-tweets

[![npm version](https://img.shields.io/npm/v/html-to-tweets.svg)](https://npm.im/html-to-tweets)
[![CircleCI](https://img.shields.io/circleci/project/github/mjm/html-to-tweets/master.svg)](https://circleci.com/gh/mjm/html-to-tweets)
![ISC License](https://img.shields.io/npm/l/html-to-tweets.svg)

A simple, opinionated translator from HTML microblog post to tweets for posting on Twitter.

## Installation

```
npm install html-to-tweets
```

## Usage

```javascript
const { translate } = require("html-to-tweets")

// Posts with titles and URLs turn into small link posts
const titledPost = {
  title: "My Blog Post",
  url: "https://example.com/my-blog-post/",
  html: "<p>If only I had something to say...</p>",
}
translate(titledPost)
// => [ { body: 'My Blog Post https://example.com/my-blog-post/', mediaURLs: [] } ]

// Untitled posts get their content reformatted for Twitter
const untitledPost = {
  title: "", // title can also be omitted
  url: "https://example.com/another-post/",
  html: `
<p>This post was <em>translated for Twitter</em> by
<a href="https://github.com/mjm/html-to-tweets">html-to-tweets</a>.
</p>
`,
}
translate(untitledPost)
// => [ { body: 'This post was translated for Twitter by html-to-tweets https://github.com/mjm/html-to-tweets', mediaURLs: [] } ]
```
