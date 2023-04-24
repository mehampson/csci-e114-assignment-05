jest.mock('@11ty/eleventy-fetch');

import { slugify, fetch_bird_photos, BirdSearch } from '../../bird-tools';
import { test, expect } from '@jest/globals';

import fetch from '@11ty/eleventy-fetch';
import { photos, no_photos } from './searchResponse';

// Test our slugify function
test('slugify', () => {
    // ā, ō
    expect(slugify('Kākāpō')).toBe('kakapo');

    // ī, ū
    expect(slugify('Tūī')).toBe('tui');

    // apostrophes and whitespace
    expect(slugify('Gould\'s Finch')).toBe('goulds-finch');
});


// Test that we're passing a successful search call back out
test('find bird photos', async () => {

    fetch.mockResolvedValue(photos);

    const test_bird: BirdSearch = {common_name: 'Test Bird', scientific_name: 'Avus probatio'};
    const bird_photos = await fetch_bird_photos(test_bird);

    expect(bird_photos.stat).toBe('ok');
    expect(bird_photos).toHaveProperty('photos');
    expect(bird_photos.photos.photo.length).toBe(2);

});


// Test that we catch a typical search error, such as from a missing API key
test('bad API response', async () => {

    fetch.mockResolvedValue(no_photos);

    const test_bird: BirdSearch = {common_name: 'Test Bird', scientific_name: 'Avus probatio'};
    const bird_photos = await fetch_bird_photos(test_bird);

    expect(bird_photos.code).toBe(100);
    expect(bird_photos).not.toHaveProperty('photos');

});
