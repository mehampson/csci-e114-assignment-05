import slugify from '../gatsby-node';
import {test, expect} from '@jest/globals';

test('slugify', () => {
    // ā, ō
    expect(slugify('Kākāpō')).toBe('kakapo');

    // ī, ū
    expect(slugify('Tūī')).toBe('tui');

    // apostrophes and whitespace
    expect(slugify('Gould\'s Finch')).toBe('goulds-finch');
});