"# URL-Hashing-System" 
"#Expected features in the system"
The system should be able to generate a short link that is easy to copy.
That short link should be able to redirect the page of the original link.
The service should be available throughout the day.
There should be an option for the user to be able to pick a custom name.
Shorter links should not be able to guess and redirect should happen with minimum latency (delay).
The service should maintain the analytics.

"#Algorithm for URL shortening"
For generating a short URL that is unique from an existing URL, we could use hashing techniques for the same. The hash which is to be encoded, could be in Base36 ([a-z ,0-9]), Base62 ([A-Z][a-z][0-9]) or Base64 ([A-Z][a-z][0-9],’+’,’/’). Let us consider Base64 encoding as it contains all characters which can be included in a URL, then what length should be the appropriate length of the shortened URL.
URL Length = 6, => 64^6 = ~70 B possible URLs
URL Length = 7, => 64^7 = ~5 T possible URLs
URL Length = 8, => 64^8 = ~280 T possible URLs
We have 62 alpha numeric chars i.e. [a-z 0–9 A-Z], though hyphen(-) and underscore(_) are allowed in a url still we want to avoid them as it would be a bad looking url like http://abc.com/c0--rw_ or http://abc.com/______-.
Following is the simple implementation of base10 to base62 converter, that’s all we need to shorten a url.
So you can see from above we can generate these 62⁶ = ~5 billion possible strings & 62⁸ = ~218 trillion possible strings and much more depending on need.

So lets say we decide we want to generate shorten url for below link

https://www.linqz.io/2018/10/how-to-build-a-tiny-url-service-that-scales-to-billions.html

so we will generate a unique id using base 62 , append it to our hosted domain lets say generated id is qa12WS4 and our hypothetical hosted domain is http://short.io so my tiny url becomes http://short.io/qa12WS4

"#Using MD5 hashing:"
After using the MD5 hashing algorithm which generates 128 bits hash value, we will have 22 characters as the output, since Base64 encoding will use 6 bits for representing a character. In this case, we can randomly select 7 characters or swap some characters and select the first 7 characters.

Some issues that we can encounter with this algorithm:

What if two same URLs could produce the same shortened URL links even after randomization and swapping?
https://iq.opengenus.org/author/pul/ could be URL encoded into https%3A%2F%2Fiq.opengenus.org%2Fauthor%2Fpul%2F (UTF-8 encoding scheme). The above algorithm will produce two different shortened URLs.
Possible solutions for the above could be:

One solution to the first problem could be to append the user id (primary key) after he is logged in, to the original URL and then apply the algorithm.
Another solution could to maintain an increasing counter with the URLs and appending it with the original URL. (But this solution could lead to sequence overflow after a particular limit)
For the second issue, the simple solution is to accept only UTF-8 URLs, if it is encoded then we need to convert it first into UTF-8 and then apply the algorithm.


