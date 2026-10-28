# Character jumpscare audio

All three recordings are listed as [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
by their creators on Freesound. These local assets use the public high-quality
MP3 previews. Retrieved October 27, 2026.

| Character / local file | Recording | Creator | Preview |
| --- | --- | --- | --- |
| Walter / `walter-jumpscare.mp3` | [TRTF2 Jumpscare Sound Remake 2.wav](https://freesound.org/people/usar2/sounds/678610/) | usar2 | https://cdn.freesound.org/previews/678/678610_12029837-hq.mp3 |
| Pip / `pip-jumpscare.mp3` | [Intense Jumpscare](https://freesound.org/people/Unaxete/sounds/366168/) | Unaxete | https://cdn.freesound.org/previews/366/366168_4128992-hq.mp3 |
| Dot / `dot-jumpscare.mp3` | [Jumpscare 1](https://freesound.org/people/zombyKlr/sounds/712416/) | zombyKlr | https://cdn.freesound.org/previews/712/712416_15425176-hq.mp3 |

Edits: trimmed trailing silence at 2.14 seconds (Walter), 2.86 seconds (Pip),
and 2.23 seconds (Dot); loudness normalized to -16 LUFS with a -2 dBTP target;
encoded as 48 kHz stereo MP3 at 160 kbps. Pitch and playback speed are unchanged.
The game plays the opening 1.2 seconds, with short edge fades to fit the
1.25-second attack animation. Background audio is ducked during the scare.

## Previous prototype recording

`possessed-scream.mp3` is retained as an unused prototype asset. It uses
[Horror Possessed Scream](https://freesound.org/people/StarLion365/sounds/792795/)
by **StarLion365**, published March 16, 2025, under CC0 1.0.
Preview: https://cdn.freesound.org/previews/792/792795_5722539-hq.mp3
Edits: excerpt 0.65–2.26 seconds, high/low-pass filtering, loudness normalization,
short edge fades, mono MP3 encoding.

## Atmosphere

`eerie-atmosphere.mp3`: [Eerie background space sound](https://freesound.org/people/LittleCloudCinema/sounds/211603/)
by **LittleCloudCinema**, published December 23, 2013.
License: [Creative Commons Attribution 3.0](https://creativecommons.org/licenses/by/3.0/).
Preview: https://cdn.freesound.org/previews/211/211603_3399852-hq.mp3
Retrieved October 27, 2026.

Edits: loudness normalized to -20 LUFS with a -3 dBTP target, a one-second
end-to-start crossfade for continuous looping, 44.1 kHz stereo MP3 at 160 kbps.
Playback uses a quiet gain with entry/exit fades and routes through the jumpscare
ducking bus. In-game attribution and modification notice appear in Credits on the main menu.

## Gameplay effects

Retrieved October 27, 2026 from the public high-quality MP3 previews.
See `effects-manifest.json` for preview URLs and exact excerpt offsets.

| Local file | Recording | Creator | License | Source excerpt |
| --- | --- | --- | --- | --- |
| `fx-footsteps.mp3` | [Footsteps w Clothes Loop](https://freesound.org/people/qubodup/sounds/816018/) | qubodup | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | 2.00–4.50 s |
| `fx-taps.mp3` | [metal_polyhedron_scrape.wav](https://freesound.org/people/nellylongarms/sounds/627523/) | nellylongarms | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | 11.92–13.02 s |
| `fx-whistle.mp3` | [Creepy whistle sound effect](https://freesound.org/people/Darklitstudio/sounds/815110/) | Darklitstudio | [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) | 1.10–4.30 s |
| `fx-clicks.mp3` | [door wood old open close creak rattle lock click.flac](https://freesound.org/people/kyles/sounds/455753/) | kyles | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | 2.02–2.20 s |
| `fx-door.mp3` | [Slam_Heavy_Metal_Door.m4a](https://freesound.org/people/81120889/sounds/547945/) | 81120889 | [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) | 1.88–2.98 s |
| `fx-electric.mp3` | [fluorescent light turn on hum buzz various.flac](https://freesound.org/people/kyles/sounds/637546/) | kyles | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | 55.36–56.21 s |
| `fx-monitor.mp3` | [CRT-ON- Deg- off.WAV](https://freesound.org/people/NLM/sounds/262401/) | NLM | [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) | 0.14–1.04 s |
| `fx-metal.mp3` | [Many Coins, Dropped on Hard Surface.wav](https://freesound.org/people/theplax/sounds/546655/) | theplax | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | 4.42–5.82 s |
| `fx-creak.mp3` | [Quiet Creak](https://freesound.org/people/LoafDV/sounds/238288/) | LoafDV | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | 0.00–2.80 s |
| `fx-power.mp3` | [Buzzing Relay](https://freesound.org/people/iainmccurdy/sounds/759257/) | iainmccurdy | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | 23.04–24.84 s |

Edits: excerpts selected from the source recordings, normalized to -20 LUFS
with a -3 dBTP target, short edge fades, mono 44.1 kHz MP3 at 128 kbps.
The runtime applies volume envelopes, stereo positioning and some playback-rate
changes. In-game Credits include source links, authors, licenses and
modification notices. Footsteps by qubodup derive from jtnewlin13's CC0
“Footsteps on Tile”, as noted on the source page.

**Noncommercial assets:** the whistle (Darklitstudio), metal door (81120889),
and CRT (NLM) are CC BY-NC 4.0. These require replacement or separate permission
before commercial use. This restriction applies to those recordings.

The theplax recording contains coins dropping/spinning; it is used as an
occasional quiet desk rattle. LoafDV's “Quiet Creak” supplies the room creaks.
