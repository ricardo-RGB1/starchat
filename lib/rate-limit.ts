import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Limit the rate at which a user can perform a certain action. Use the Ratelimit library to implement a sliding window rate limiter.
export async function rateLimit(identifier: string){
    const rateLimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, "10 s"),
        analytics: true,
        prefix: "@upstash/ratelimit"
    });

    return await rateLimit.limit(identifier);
}




// Here is a breakdown of what the code does:

// The function takes one parameter: identifier. This parameter is used to identify the user whose rate is being limited.

// The function creates a new Ratelimit instance using the Ratelimit constructor. The constructor takes an object with several properties:

// - redis: This property is set to a Redis client instance created using the fromEnv method of the Redis class. This method creates a Redis client instance using environment variables.
// - limiter: This property is set to a sliding window rate limiter that allows 10 requests per 10 seconds.
// - analytics: This property is set to true, which enables analytics for the rate limiter.
// - prefix: This property is set to "@upstash/ratelimit", which is used as the prefix for the Redis keys that are used to store the rate limit data.
// The function then calls the limit method on the rateLimit object, passing in the identifier parameter. The limit method returns a Promise that resolves to an object with two properties: allowed and remaining. The allowed property is a boolean that indicates whether the user is allowed to perform the action. The remaining property is the number of requests remaining in the current rate limit window.

// The function returns the result of the limit method, which is an object with the allowed and remaining properties.