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

test("translates a long microblog post", () => {
  const input = {
    title: "",
    url: "https://example.com/abc/",
    html: `
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
  }

  expect(translate(input)).toEqual([
    {
      body:
        "Spicy jalapeno meatloaf shoulder sirloin, cow frankfurter tail pork belly leberkas brisket chuck pancetta bresaola. Shankle chuck rump kielbasa burgdoggen. Filet mignon turkey doner t-bone bresaola, ribeye biltong. Shank biltong kevin pork pancetta frankfurter, turkey (1/3)",
      mediaURLs: [],
    },
    {
      body:
        "tongue pork loin doner turducken drumstick jerky boudin t-bone.\n\nPancetta shank boudin, tail corned beef tenderloin kevin buffalo sausage tri-tip. T-bone landjaeger porchetta corned beef. Spare ribs strip steak bresaola ham pancetta prosciutto. T-bone turkey fatback, (2/3)",
      mediaURLs: [],
    },
    {
      body:
        "turducken pork pig cow jerky short loin ball tip. Boudin ball tip brisket, shankle chuck ham frankfurter hamburger buffalo landjaeger. (3/3)",
      mediaURLs: [],
    },
  ])
})
