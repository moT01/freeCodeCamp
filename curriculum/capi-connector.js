const marked = require('marked');

export async function addDescriptionToChallenge(challenge, lang) {
  // throw 'TODO: Call cAPI to get description for challenge.id and lang';

  if (lang !== 'english') {
    return;
  }

  const { description } = await fetch(
    `https://www.freecodecamp.org/api/challenge/get-description?challengeId=${challenge.id}`
  ).then(res => res.json());

  const htmlDescription = marked(description);

  challenge.description = htmlDescription;
}
