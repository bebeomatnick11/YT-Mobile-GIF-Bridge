
# YT Mobile GIF Bridge

A mobile-first experiment for YouTube GIF comments.

## Status

Experimental compatibility checker. Actual GIF submission on mobile web has not been verified.

## Features

- Touch-friendly floating helper
- Detects visible YouTube GIF controls
- Attempts to open the official GIF picker
- No API keys or account credentials required
- No fake success messages

## Android installation

1. Install a browser that supports a compatible userscript manager.
2. Create a new userscript in that manager.
3. Copy `userscript/yt-mobile-gif-bridge.user.js` into it.
4. Enable it for `m.youtube.com`.
5. Open a video, expand comments, and tap GIF Bridge.

Browser support varies. Do not assume Chrome Android or Cốc Cốc supports userscripts natively.

## Limitations

A userscript cannot modify the official YouTube Android app. A custom button cannot grant server-side permissions. If YouTube does not expose or accept GIF comments for the current client/account, this tool cannot guarantee submission.

## Security

Never share YouTube cookies, access tokens, or passwords.
