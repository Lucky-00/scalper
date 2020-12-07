# scalper

Online shop availability checker
This lightweight Node.js application will detect and notify you when an item becomes available at an online shop, e.g. Amazon.
Can be useful given the recent stock shortages of PlayStation 5, Xbox Series X, Nvidia RTX 3000 Series and Ryzen 5...

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
   Edit the index.js to performa an action when the item is available. It's up to you what you want to do with it, for example: post a Tweet, send an email, or buy the item instantly.
   Add support for more online shops by editing the parse.js file.
   Add links to urls.js for the items you're interested in.

6. Run the app:

   > node index

7. That's pretty much done! Oh, and one more thing. I recommend using a VPN, just in case...
