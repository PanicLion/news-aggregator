
# News Aggregator App

It allows users to fetch news articles from multiple sources based on their preferences using NewsAPI.

> NewsAPI doesn't allow to mix category and sources therefore two different endpoints for fetching news based on user preferences.

## Endpoints

- **POST** /register: Register a new user.
```
{
    "name": "John Smith",
    "email": "john@matrix.com",
    "password": "P@ssw0rd",
    "role": "user",
    "news_preference": {
        "categories": "general",
        "sources": ["the-times-of-india", "espn-cric-info"]
    }
}
```

- **POST** /login: Log in a user.
```
{
    "email": "john@matrix.com",
    "password": "P@ssw0rd"
}
```

- **GET** /preferences: Retrieve the news preferences for the logged-in user.

- **PUT** /preferences: Update the news preferences for the logged-in user.
```
{
    "categories": "sports",
    "sources": [
        "bloomberg",
        "buzzfeed",
        "bbc-sport"
    ]
}
```
- **GET** /news/category: Fetch news articles based on the logged-in user's preferred category. The response will be served from cache if requested within expiry time.

- **GET** /news/sources: Fetch news articles based on the logged-in user's preferred sources.

- **GET** /news/search/:keyword: search for news articles based on keywords
