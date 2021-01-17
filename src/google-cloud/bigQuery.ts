import { BigQuery } from '@google-cloud/bigquery'


class BigQueryManager {
    private static instance: BigQueryManager;
    private bigQuery: BigQuery;

    constructor() {
        this.bigQuery = new BigQuery();
    }

    static getInstance(): BigQueryManager {
        if (!BigQueryManager.instance) {
            BigQueryManager.instance = new BigQueryManager();
        }

        return BigQueryManager.instance;
    }

    public async queryForNumberOfDailyActiveUsers () {

        const query = "\
            SELECT count(distinct user_id) as dailyActiveUsers FROM `codewayassignment.event_log.event_schema` \
            where date(TIMESTAMP_MILLIS(CAST(event_time as INT64))) = CURRENT_DATE()"

        const options = {
            query: query
        }

        const [job] = await this.bigQuery.createQueryJob(options);

        const [rows] = await job.getQueryResults()

        return rows[0].dailyActiveUsers
    }

    public async queryForNumberOfTotalUsers () {

        const query = "\
            SELECT count(distinct user_id) as totalUsers FROM `codewayassignment.event_log.event_schema`"

        const options = {
            query: query
        }

        const [job] = await this.bigQuery.createQueryJob(options);

        const [rows] = await job.getQueryResults()

        return rows[0].totalUsers
    }

    public async queryForAverageSessionDuration () {

        const query = "\
            with session_durations as ( \
                SELECT timestamp_diff( \
                    TIMESTAMP_MILLIS(CAST(max(event_time) as INT64)), \
                    TIMESTAMP_MILLIS(CAST(min(event_time) as INT64)), SECOND) as session_duration \
                FROM `codewayassignment.event_log.event_schema` group by session_id) \
            select cast(avg(session_duration) as INT64) as average_session_duration from session_durations \
            "

        const options = {
            query: query
        }

        const [job] = await this.bigQuery.createQueryJob(options);

        const [rows] = await job.getQueryResults()

        return rows[0].average_session_duration
    }
}

export = BigQueryManager
