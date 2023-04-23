import slugify from '../gatsby-node';

test('slugify', () => {
    // ā, ō
    expect(slugify('Kākāpō')).toBe('kakapo');

    // ī, ū
    expect(slugify('Tūī')).toBe('tui');

    // apostrophes and whitespace
    expect(slugify("Gould's Finch")).toBe('goulds-finch');
})