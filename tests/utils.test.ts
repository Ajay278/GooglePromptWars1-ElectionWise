import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cn, generateId, formatDate, whatsappShare, askAgent, translateTexts } from '../src/lib/utils';

// ── cn() ──────────────────────────────────────────────────────────────────────
describe('cn() — Tailwind class merger', () => {
  it('merges basic class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes (falsy values omitted)', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('deduplicates conflicting Tailwind classes (last wins)', () => {
    // tailwind-merge resolves conflicts — bg-red should override bg-blue
    const result = cn('bg-blue-500', 'bg-red-500');
    expect(result).toBe('bg-red-500');
  });

  it('handles undefined and null gracefully', () => {
    expect(cn('foo', undefined, null as any)).toBe('foo');
  });
});

// ── generateId() ──────────────────────────────────────────────────────────────
describe('generateId()', () => {
  it('returns a non-empty string', () => {
    expect(typeof generateId()).toBe('string');
    expect(generateId().length).toBeGreaterThan(0);
  });

  it('returns unique IDs on repeated calls', () => {
    const ids = new Set(Array.from({ length: 100 }, generateId));
    expect(ids.size).toBe(100);
  });

  it('returns alphanumeric-only characters', () => {
    const id = generateId();
    expect(id).toMatch(/^[a-z0-9]+$/);
  });
});

// ── formatDate() ──────────────────────────────────────────────────────────────
describe('formatDate()', () => {
  it('formats a date in Indian locale format', () => {
    const date = new Date('2026-01-15');
    const result = formatDate(date);
    // Should contain the year and month name
    expect(result).toContain('2026');
    expect(result).toContain('15');
  });

  it('returns a non-empty string', () => {
    expect(formatDate(new Date())).toBeTruthy();
  });
});

// ── whatsappShare() ──────────────────────────────────────────────────────────
describe('whatsappShare()', () => {
  const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

  afterEach(() => openSpy.mockClear());

  it('calls window.open with a WhatsApp URL', () => {
    whatsappShare('Test message');
    expect(openSpy).toHaveBeenCalledOnce();
    const [url, target] = openSpy.mock.calls[0] as [string, string];
    expect(url).toContain('https://wa.me/');
    expect(url).toContain(encodeURIComponent('Test message'));
    expect(target).toBe('_blank');
  });

  it('encodes special characters in the message', () => {
    whatsappShare('Hello & "World"');
    const [url] = openSpy.mock.calls[0] as [string];
    expect(url).toContain('%26'); // & encoded
  });
});

// ── askAgent() ────────────────────────────────────────────────────────────────
describe('askAgent()', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => vi.restoreAllMocks());

  it('returns the reply string on success', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'You can vote at your nearest booth.' }),
    });

    const result = await askAgent(
      [{ role: 'user', content: 'Where do I vote?' }],
      'en',
      'All India',
      'assistant'
    );
    expect(result).toBe('You can vote at your nearest booth.');
  });

  it('throws an error when the API responds with a non-OK status', async () => {
    (fetch as any).mockResolvedValueOnce({ ok: false });
    await expect(
      askAgent([{ role: 'user', content: 'test' }], 'en', 'All India')
    ).rejects.toThrow('API Error');
  });

  it('sends the correct mode to the API', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'VERDICT: True\nEXPLANATION: Correct.' }),
    });

    await askAgent([{ role: 'user', content: 'Voting test' }], 'en', 'All India', 'detector');

    const body = JSON.parse((fetch as any).mock.calls[0][1].body);
    expect(body.mode).toBe('detector');
  });
});

// ── translateTexts() ──────────────────────────────────────────────────────────
describe('translateTexts()', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => vi.restoreAllMocks());

  it('returns original texts without an API call when targetLang is "en"', async () => {
    const texts = ['Hello', 'World'];
    const result = await translateTexts(texts, 'en');
    expect(result).toEqual(texts);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns translated strings on success', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ translations: ['नमस्ते', 'दुनिया'] }),
    });

    const result = await translateTexts(['Hello', 'World'], 'hi');
    expect(result).toEqual(['नमस्ते', 'दुनिया']);
  });

  it('falls back to original texts if the API call fails', async () => {
    (fetch as any).mockResolvedValueOnce({ ok: false });
    const texts = ['Hello'];
    const result = await translateTexts(texts, 'hi');
    expect(result).toEqual(texts);
  });
});
