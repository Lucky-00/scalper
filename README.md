# scalper

Online shop availability checker

This lightweight Node.js application will detect and notify you when an item becomes available/unavailable at an online shop.

Can be useful given the recent stock shortages of PlayStation 5, Xbox Series X, Nvidia RTX 3000 Series and Ryzen 5... Currently works with Amazon only.

I recommend using a **VPN**, just in case...

**Pull requests welcome to support more shops / countries**

## Setup

1. Install nodejs

   > sudo apt install nodejs

2. Install npm

   > curl https://www.npmjs.com/install.sh | sudo sh

3. If using Raspberry Pi or other device with ARM architecture, install Chromium:

   > sudo apt install chromium-browser chromium-codecs-ffmpeg

4. Install all Node dependencies:

   > cd scalper

   > npm i

5. Modify the source code to your preferences

   Edit the **index.js** to performa an action when the item is available. It's up to you what you want to do with it, for example: post a Tweet, send an email, or buy the item instantly.

   There are three functions you can customize: **becameAvailable**, **becameUnavailable** and **hasNotChanged**. Each one can do a different thing.

   Add support for more online shops by editing the **parse.js** file.

   Add shops and links to **urls.js** for the items you're interested in. Shop names must match the function names in **parse.js**. Currently only Amazon is supported.

6. Run the app:

   > node index
