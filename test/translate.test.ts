import translate from "../src"

test("translates titled post", () => {
  const input = {
    title: "Welcome to Microblogging",
    url: "https://example.com/abc/",
    html: "Who cares?",
  }
  expect(translate(input)).toEqual([
    {
      body: "Welcome to Microblogging https://example.com/abc/",
      mediaURLs: [],
    },
  ])
})

test("translates short microblog post", () => {
  const input = {
    title: "",
    url: "https://example.com/abc/",
    html: "This is a simple <em>tweet</em>.",
  }
  expect(translate(input)).toEqual([
    {
      body: "This is a simple tweet.",
      mediaURLs: [],
    },
  ])
})

test("translates a microblog post with images", () => {
  const input = {
    title: "",
    url: "https://example.com/abc/",
    html:
      '<p>This is a tweet with media.</p><figure><img src="https://example.com/foo.jpg"></figure>',
  }
  expect(translate(input)).toEqual([
    {
      body: "This is a tweet with media.",
      mediaURLs: ["https://example.com/foo.jpg"],
    },
  ])
})
