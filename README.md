# SCISSORS ✂

## DESCRIPTION

SCISSORS is a powerful URL shortening service that provides an intuitive interface to shorten and customize your URLs. With URL Scissors, you can easily generate shortened aliases for your long and complex URLs, making them more manageable and shareable.

Key Features:

- Shorten any valid and accessible URL.
- Customize the shortened alias to make it more memorable and descriptive.
- Generate **downloadable** QR codes for your shortened URLs, allowing easy access through mobile devices.
- All users, whether authenticated or not, can utilize the URL shortening, customization, and QR code generation features.

Authenticated User Features:

- Authenticated users gain access to additional features:
- View their shortened URL history for easy management.
- Access detailed statistics for each shortened URL, including click counts and sources.
- Track and analyze the performance of their shortened URLs.

Scissors simplifies URL management and provides a seamless experience for users, allowing them to optimize their URL sharing process. Experience the convenience of concise and trackable URLs by using URL Scissors today.

Built as a capstone project at [Altschool Africa School of Engineering - Node.js track](https://www.altschoolafrica.com/schools/engineering)

## LINKS

API LIVE BASEURL: https://scissors-3d3o.onrender.com

FULL API DOCUMENTATION: https://documenter.getpostman.com/view/30061272/2sA35A7QcB

## TECH STACK

Node Js,MERN Mongodb, Typescript and Express.

## DATABASE

MongoDB

## HOW TO RUN PROJECT

### Prerequisites & Installation

To be able to get this application up and running, ensure to have [node](https://nodejs.org/en/download/) installed on your device.

### Development Setup

1. **Download the project locally by forking this repo and then clone or just clone directly via:**

```bash
git clone https://github.com/SarkiPraizy/SCISSORS.git
```

2. **Set up the Database**

   - Create 2 MongoDB databases (main and test) on your local MongoDB server or in the cloud (Atlas)
   - Copy the connection strings and assign it to the `MONGODB_URL`
   - On connection to these databases, two collections - `users` and `urls` will be created.

   ## Models

---

### User

| field           | data_type | constraints                    |
| --------------- | --------- | ------------------------------ |
| \_id            | ObjectId  | auto_generated                 |
| firstName       | String    | required                       |
| lastName        | String    | required                       |
| email           | String    | required & unique              |
| password        | String    | required                       |
| confirmPassword | String    | required (must match password) |

### URL

| field    | data_type            | constraints                            |
| -------- | -------------------- | -------------------------------------- |
| \_id     | ObjectId             | auto_generated                         |
| origUrl  | String               | required & unique                      |
| shortUrl | String               | unique & dynamically_assigned          |
| newUrl   | String               | unique & required/dynamically_assigned |
| userId   | ObjectId (ref: User) | dynamically_assigned if logged in      |
| clicks   | Number               | Defaults to 0                          |

1. **Install the dependencies** from the root directory, in terminal run:

```
npm install
```

1. **Create a .env file**.

   - Copy and paste the content of `example.env` into this new `.env` file.
   - Set the `EMAIL_USER` variable to your email address.
   - Set the `EMAIL_PASSWORD` variable to your email account [app password](https://support.google.com/mail/search?q=app+password&from_promoted_search=true&sjid=15749770299856528848-EU).
   - Visit [Redis Cloud](https://redis.com/try-free/?utm_source=redisio&utm_medium=referral&utm_campaign=2023-09-try_free&utm_content=cu-redis_cloud_users&_gl=1*v6e5ox*_ga*MTgyOTA0NjU0Mi4xNzAyMTQ0NTEy*_ga_8BKGRQKRPV*MTcxMTM1MDMyNS4zLjEuMTcxMTM1MDMzMS41NC4wLjA.*_gcl_au*NzUwMzUzNjU2LjE3MTEzNTAzMjU.&_ga=2.29640319.1940881539.1711350325-1829046542.1702144512.) to create a Redis data store and get the values for these variables: `REDIS_HOST`, `REDIS_PORT`, `REDIS_USERNAME`, `REDIS_PASSWORD`

2. **Run the development server:**

```bash
npm run start:dev
```

1. **At this point, your server should be up and running** at[http://localhost:7070](http://localhost:7070)

## DEPLOYMENT

https://scissors-3d3o.onrender.com

## Authors

[Praise Ibu] (https://github.com/SarkiPraizy)

## Acknowledgements

The entire awesome team at ALTSCHOOL
