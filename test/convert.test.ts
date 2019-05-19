import { convert } from "../src/convert"

const scenarios: any[][] = [
  ["an empty string", "", "", []],
  [
    "a simple string",
    "This is a very simple tweet.",
    "This is a very simple tweet.",
    [],
  ],
  [
    "a string with unused tags",
    "<p>This is <strong>also</strong> a si<em>mp</em>le tweet.</p>",
    "This is also a simple tweet.",
    [],
  ],
  [
    "paragraphs to empty lines",
    "<p>Paragraph 1</p><p>Paragraph 2</p>",
    "Paragraph 1\n\nParagraph 2",
    [],
  ],
  [
    "br tags to linebreaks",
    "Some content<br>Some more content<br />This is it.",
    "Some content\nSome more content\nThis is it.",
    [],
  ],
  [
    "a link to a URL at the end",
    'This is <a href="https://example.com/foo/bar">some #content.</a>',
    "This is some #content. https://example.com/foo/bar",
    [],
  ],
  [
    "multiple links in the order they appear",
    'This is <a href="https://example.com/foo/bar">some</a> <a href="http://example.com/bar">#content.</a>',
    "This is some #content. https://example.com/foo/bar http://example.com/bar",
    [],
  ],
  [
    "links to Twitter user profiles",
    'This reminds me of something <a href="https://twitter.com/example123">Example 123</a> said.',
    "This reminds me of something @example123 said.",
    [],
  ],
  [
    "blockquotes to regular quotes",
    "<p>Check this thing out:</p><blockquote>I said a thing</blockquote>",
    "Check this thing out:\n\n“I said a thing”",
    [],
  ],
  [
    "html entities",
    "<p>I&#8217;m having a &#8220;great time&#8221;. Here's &lt;strong&gt;some html&lt;/strong&gt;",
    "I’m having a “great time”. Here's <strong>some html</strong>",
    [],
  ],
  [
    "without trailing newlines",
    "<p>This is some text</p>\n",
    "This is some text",
    [],
  ],
  [
    "image tags to media URLs",
    '<p>Check it out!</p><p><img src="https://example.com/foo.jpg"><img src="https://example.com/bar.jpg"></p>',
    "Check it out!",
    ["https://example.com/foo.jpg", "https://example.com/bar.jpg"],
  ],
  [
    "embedded tweets to URLs",
    `<p>And I&#8217;m sitting here with two level 117 characters.</p>
    <blockquote class="twitter-tweet" data-width="550" data-dnt="true">
    <p lang="en" dir="ltr">Congratulations <a href="https://twitter.com/Methodgg?ref_src=twsrc%5Etfw">@Methodgg</a> on the world first clear of Mythic Uldir!!! <a href="https://t.co/iUCOwDbPYw">pic.twitter.com/iUCOwDbPYw</a></p>
    <p>&mdash; World of Warcraft (@Warcraft) <a href="https://twitter.com/Warcraft/status/1042485327267422208?ref_src=twsrc%5Etfw">September 19, 2018</a></p></blockquote>
    <p><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></p>`,
    "And I’m sitting here with two level 117 characters. https://twitter.com/Warcraft/status/1042485327267422208",
    [],
  ],
  [
    "embedded YouTube videos to URLs",
    `<p>I think the Sims 4 episode of Monster Factory is my favorite of them all. Watching this just brings me so much joy.</p>
    <p><iframe width="480" height="270" src="https://www.youtube.com/embed/TamwFUUd9Yk?feature=oembed" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>`,
    "I think the Sims 4 episode of Monster Factory is my favorite of them all. Watching this just brings me so much joy. https://www.youtube.com/watch?v=TamwFUUd9Yk",
    [],
  ],
  [
    "collapsing spacing",
    `
    <p>Spicy jalapeno meatloaf shoulder sirloin, cow frankfurter tail pork belly
    leberkas brisket chuck pancetta bresaola. Shankle chuck rump kielbasa burgdoggen.
    Filet mignon turkey doner t-bone bresaola, ribeye biltong. Shank biltong kevin
    pork pancetta frankfurter, turkey tongue pork loin doner turducken drumstick
    jerky boudin t-bone.</p>

    <p>Pancetta shank boudin, tail corned beef tenderloin kevin buffalo sausage
    tri-tip. T-bone landjaeger porchetta corned beef. Spare ribs strip steak bresaola
    ham pancetta prosciutto. T-bone turkey fatback, turducken pork pig cow jerky
    short loin ball tip. Boudin ball tip brisket, shankle chuck ham frankfurter
    hamburger buffalo landjaeger.</p>
    `,
    `Spicy jalapeno meatloaf shoulder sirloin, cow frankfurter tail pork belly leberkas brisket chuck pancetta bresaola. Shankle chuck rump kielbasa burgdoggen. Filet mignon turkey doner t-bone bresaola, ribeye biltong. Shank biltong kevin pork pancetta frankfurter, turkey tongue pork loin doner turducken drumstick jerky boudin t-bone.

Pancetta shank boudin, tail corned beef tenderloin kevin buffalo sausage tri-tip. T-bone landjaeger porchetta corned beef. Spare ribs strip steak bresaola ham pancetta prosciutto. T-bone turkey fatback, turducken pork pig cow jerky short loin ball tip. Boudin ball tip brisket, shankle chuck ham frankfurter hamburger buffalo landjaeger.`,
    [],
  ],
]

test.each(scenarios)("converts %s", (_desc, input, output, mediaUrls) => {
  const result = convert(input)
  expect(result.body).toEqual(output)
  expect(result.mediaURLs).toEqual(mediaUrls)
})

test("uses base URL for relative media and link URLs", () => {
  const input = `
  <p>This is <a href="/foo/bar">a relative link</a>.</p>
  <figure><img src="/baz.jpg"></figure>`
  const result = convert(input, {
    baseURL: "https://example.org/2019/foo-bar-baz/",
  })

  expect(result.body).toEqual(
    "This is a relative link. https://example.org/foo/bar"
  )
  expect(result.mediaURLs).toEqual(["https://example.org/baz.jpg"])
})
