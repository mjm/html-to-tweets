import { translate } from "../src"

test("translates titled post", () => {
  const input = {
    title: "Welcome to Microblogging",
    url: "https://example.com/abc/",
    html: "Who cares?",
  }
  expect(translate(input)).toMatchSnapshot()
})

test("translates short microblog post", () => {
  const input = {
    title: "",
    url: "https://example.com/abc/",
    html: "This is a simple <em>tweet</em>.",
  }
  expect(translate(input)).toMatchSnapshot()
})

test("translates a microblog post with images", () => {
  const input = {
    title: "",
    url: "https://example.com/abc/",
    html:
      '<p>This is a tweet with media.</p><figure><img src="/foo.jpg"></figure>',
  }
  expect(translate(input)).toMatchSnapshot()
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

  expect(translate(input)).toMatchSnapshot()
})

test("translates a retweet with a comment", () => {
  const input = {
    title: "",
    url: "https://example.com/abc",
    html: `
    <p>And I&#8217;m sitting here with two level 117 characters.</p>
    <blockquote class="twitter-tweet" data-width="550" data-dnt="true">
    <p lang="en" dir="ltr">Congratulations <a href="https://twitter.com/Methodgg?ref_src=twsrc%5Etfw">@Methodgg</a> on the world first clear of Mythic Uldir!!! <a href="https://t.co/iUCOwDbPYw">pic.twitter.com/iUCOwDbPYw</a></p>
    <p>&mdash; World of Warcraft (@Warcraft) <a href="https://twitter.com/Warcraft/status/1042485327267422208?ref_src=twsrc%5Etfw">September 19, 2018</a></p></blockquote>
    <p><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></p>
    `,
  }

  expect(translate(input)).toMatchSnapshot()
})

test("translates a retweet without comment", () => {
  const input = {
    title: "",
    url: "https://example.com/abc",
    html: `
    <blockquote class="twitter-tweet" data-width="550" data-dnt="true">
    <p lang="en" dir="ltr">Congratulations <a href="https://twitter.com/Methodgg?ref_src=twsrc%5Etfw">@Methodgg</a> on the world first clear of Mythic Uldir!!! <a href="https://t.co/iUCOwDbPYw">pic.twitter.com/iUCOwDbPYw</a></p>
    <p>&mdash; World of Warcraft (@Warcraft) <a href="https://twitter.com/Warcraft/status/1042485327267422208?ref_src=twsrc%5Etfw">September 19, 2018</a></p></blockquote>
    <p><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></p>
    `,
  }

  expect(translate(input)).toMatchSnapshot()
})
