import { mdToLife } from './utils';

const lifeMd = `
# Life in weeks

**День народженя:** 01.01.1990

## Дитинство

**Період:** 01.09.2007 - 29.06.2011

**Колір:** \`#F09389\`

**Теги:** #studing

Ступінь: молодший спеціаліст
`;

describe('mdToLife', () => {
  it('should parse life period content', () => {
    expect(mdToLife(lifeMd)).toEqual({
      birthday: 631152000000,
      periods: [
        {
          name: 'Дитинство',
          start: 1188604800000,
          end: 1309305600000,
          color: '#F09389',
          tags: ['studing'],
          description: 'Ступінь: молодший спеціаліст',
        },
      ],
    });
  });
});
