import ratelimit from "../config/upstash.js"


const rateLimiter = async (req, res, next) => {
    try {
        const { success } = await ratelimit.limit("my-limit-key");
        if (!success) {
            return res.status(429).json({
                message: "Too many requests, please try again try later",
            });
        }
        next();

    } catch (error) {
        console.log("Rate limit error",error);

    }
}

export default rateLimiter;