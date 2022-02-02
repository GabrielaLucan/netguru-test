import moment from 'moment';
import { redisClient } from './server.js';

const WINDOW_SIZE_IN_MONTHS = 1;
const MAX_WINDOW_REQUEST_COUNT = 5;
const WINDOW_LOG_INTERVAL_IN_MONTHS = 1;

export const rateCheck = async (req, res, next) => {
    try {
        if (!redisClient) {
            throw new Error('Redis client does not exist!');
        }

        /* Premium users are not limited */
        if (req.user.role === 'premium') {
            return next();
        }

        const id = String(req.user.userId);
        const record = await redisClient.getAsync(id);
        const currentRequestTime = moment();

        /* If no record is found, create a new record per user and store to redis */
        if (!record || record === true) {
            const newRecord = [{
                requestTimeStamp: currentRequestTime.unix(),
                requestCount: 1
            }];
            redisClient.set(id, JSON.stringify(newRecord));
            return next();
        }

        /* If record is found, parse value and find nr of req user has made in the last window */
        const data = JSON.parse(record);
        const windowStartTimestamp = moment().subtract(WINDOW_SIZE_IN_MONTHS, 'month').unix();
        const requestsWithinWindow = data.filter(({ requestTimeStamp }) => requestTimeStamp > windowStartTimestamp);
        const totalWindowRequestsCount = requestsWithinWindow.reduce((acc, { requestCount }) => acc + requestCount, 0);

        /* If number of requests made is greater than or equal to the desired maximum, return error */
        if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
            return res
                .status(429)
                .send(`You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_MONTHS} month limit!`)
        }

        /* If number of requests made is less than allowed maximum, log new entry */
        const lastRequestLog = data[data.length - 1];
        const potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
            .subtract(WINDOW_LOG_INTERVAL_IN_MONTHS, 'months')
            .unix();

        /* If interval has not passed since last request log, increment counter */
        if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
            lastRequestLog.requestCount++;
            data[data.length - 1] = lastRequestLog;
        } else {
            /* If interval has passed, log new entry for current user and timestamp */
            data.push({
                requestTimeStamp: currentRequestTime.unix(),
                requestCount: 1
            });
        }

        redisClient.set(id, JSON.stringify(data));
        return next();

    } catch (error) {
        return next(error);
    }
};
