cs448b_finalproject
===================
Cindy Chang, Emily Cheng, Julia Lee, JJ Liu

CS448b final project: visualization for Kijani Grows.
The visualization dashboard is located at ./rickshaw/dashboard.html

NOTE: 
** Best viewed in Chrome or Safari. 
** When viewing in browser, if the visualization doesn't show up initially, it is important to first close chrome entirely, then open chrome from terminal with the following flag:
 open -a 'Google Chrome' --args --allow-file-access-from-files

This to overcome a same origin access issue that is due the fact that from local, all the files have origin "null" and thus are blocked due to same origin security issues. This wouldn't be a problem once our visualization is actually deployed, since all of our files would indeed be of the same origin. 
