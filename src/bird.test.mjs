import slugify from '../gatsby-node';

test('slugify', () => {
    expect(slugify('kakapo')).toBe('kakapo');
})