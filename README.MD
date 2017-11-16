# NowPlaying
## GA WDI13 Project Four - Ryan Monro

(http://nowplaying13.herokuapp.com)

## The Pitch
Myself and a few of my friends use WhatsApp almost exclusively for sharing Spotify links. I decided a replacement for that would be fun to build: a messaging site where all you can do is share the song you're listening to, and comment on other people's shared songs. Surprisingly, Spotify's own app doesn't have that capability.

## Planning 
Trello board (https://github.com/ryanmonro/nowplaying/blob/master/docs/trello.jpeg) 
Wireframes (https://github.com/ryanmonro/nowplaying/blob/master/docs/wireframes.JPG) 
ER Diagram (https://github.com/ryanmonro/nowplaying/blob/master/docs/er.JPG)

## User Stories
- "As a user I need to be able to log in with my Spotify account."
- "As a user I want to see songs that others have shared recently."
- "As a user I want to be able to always see the song I'm currently listening to on Spotify."
- "As a user I want a simple Share button to post my current song for other users to see."

## Approach
In a way, I started building this app four times. After deciding it was what I wanted to build, I first began building a Rails app with a React front-end via react-rails front-end. After realising react-rails's implementation of React was not what I'd hoped for, I reverted to just building a Rails app. After getting to the working-database-and-routes stage I decided "I made a full stack JS app" was something I really wanted to achieve by the end of the week, and built the backend in Express with a rudimentary front end that accessed the API via AJAX. Then I threw that front end out the window and built a React front-end. The React development happened inside the `client` folder, and Express served the routes in the following manner:
```
/      (statically serving /client/build)
/api/* (handled by express)
/login (handled by express```
This allowed me to use the React development server in development, and then build it to the build folder so it could be served by my backend server.

## Cool Tech
### React
- It took a while to understand how it worked and why it didn't work when it didn't, but in the end I loved how React uses state, and reusable stateful components really simplified the app's structure.

### Node and Express.js
- I really wanted to build something with this since I started the course, so this was immensely satisfying. The plethora of NPM packages a few keystrokes away came in handy too.

### Spotify API
- The Spotify API was something I wanted to incorporate, as it's an app that I use on a daily basis. Once the authentication was sorted out, it was very easy to fetch user and song data from my front-end.

## Challenges
- React in the front, Express in the back, on one server! That was the dream. I wanted to avoid running two servers just because I knew it was possible. 
- Databases and user authentication in Node. That stuff is easy in Rails. It was completely untested waters for me in Node.
- I had the bright idea of using sqlite3 as a database because 'it seemed simple'. Unfortunately, you can't deploy it to Heroku.
- Chrome's caching letting React get away with handling the routes I wanted Express to handle.
- Getting used to the jQuery DOM manipulation and then having to forget about all that and do things the React way.
- Authorisation with the Spotify API. It was tricky enough trying to understand that whole complicated secret handshake, let alone implement it.
- Troubleshooting React without knowing exactly how it works. They were hard issues to google because my situation was so specific. 
- If you try to put more than five Spotify players on a page, they won't all work. Each one has to maintain a TCP connection to the Spotify API, and it turns out HTTP actually has a limit of the number of open connections a page can have. That was the end of my dream of having a feed full of Spotify players.
- Waiting for things to happen asynchronously, and making sure they still happened in the right way.

## Lessons Learned
- Testing. I should have gotten that involved earlier. It's called test driven development, not test-as-an-afterthought driven development.
- I really wanted to build something in Node and React. In hindsight, it would have been better to choose the right tool for the job.
- This was possibly too much new tech to take on in go. In the end I built an app that doesn't do much, that I had to learn a lot of new things to build. There would be a lot more features if I'd stuck with Rails.
- On the other hand, half-building the app in Rails first, and then with jQuery and Ajax second, and then finally in React, really taught me the differences between working in all those technologies. 

## Future Features
- [ ] let users comment on posts. It was a big part of my idea from the start, and the database supports it, but I didn't have time to make it work
- [ ] let users follow other users. The default view could be a feed of 'shared tracks from those who I'm following', with another view for 'last ten tracks shared by all users'
- [ ] User view: see their profile, recently shared tracks
- [ ] allow sharing from sources other than Spotify
- [ ] explore artists/albums/genres via the Spotify API - there's a lot of data out there