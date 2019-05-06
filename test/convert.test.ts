import convert from "../src/convert"

const scenarios = [
  ["an empty string", "", ""],
  [
    "a simple string",
    "This is a very simple tweet.",
    "This is a very simple tweet.",
  ],
  [
    "a string with unused tags",
    "<p>This is <strong>also</strong> a si<em>mp</em>le tweet.</p>",
    "This is also a simple tweet.",
  ],
  [
    "paragraphs to empty lines",
    "<p>Paragraph 1</p><p>Paragraph 2</p>",
    "Paragraph 1\n\nParagraph 2",
  ],
  [
    "br tags to linebreaks",
    "Some content<br>Some more content<br />This is it.",
    "Some content\nSome more content\nThis is it.",
  ],
  [
    "a link to a URL at the end",
    'This is <a href="https://example.com/foo/bar">some #content.</a>',
    "This is some #content. https://example.com/foo/bar",
  ],
  [
    "multiple links in the order they appear",
    'This is <a href="https://example.com/foo/bar">some</a> <a href="http://example.com/bar">#content.</a>',
    "This is some #content. https://example.com/foo/bar http://example.com/bar",
  ],
  [
    "links to Twitter user profiles",
    'This reminds me of something <a href="https://twitter.com/example123">Example 123</a> said.',
    "This reminds me of something @example123 said.",
  ],
  [
    "blockquotes to regular quotes",
    "<p>Check this thing out:</p><blockquote>I said a thing</blockquote>",
    "Check this thing out:\n\n“I said a thing”",
  ],
  [
    "html entities",
    "<p>I&#8217;m having a &#8220;great time&#8221;. Here's &lt;strong&gt;some html&lt;/strong&gt;",
    "I’m having a “great time”. Here's <strong>some html</strong>",
  ],
  [
    "without trailing newlines",
    "<p>This is some text</p>\n",
    "This is some text",
  ],
]

test.each(scenarios)("converts %s", (_desc, input, output) => {
  expect(convert(input).text).toEqual(output)
})
