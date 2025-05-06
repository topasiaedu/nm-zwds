# Profile Simulation Scripts

These scripts allow you to test your database's performance by simulating large numbers of profile creations without affecting the UI.

## Setup

1. Create a `.env` file in this directory with your Supabase credentials:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Install dependencies:

```bash
npm install
```

## Quick Test

For a simple test with minimal dependencies:

```bash
node quick-test.js [count] [batchSize] [delayMs] [userId]
```

Or use the npm script:

```bash
npm run test
```

### Parameters

- `count`: Number of profiles to create (default: 500)
- `batchSize`: Number of profiles to insert in each batch (default: 50)
- `delayMs`: Delay between batches in milliseconds (default: 100)
- `userId`: User ID to associate with all profiles (default: "2fdd8c60-fdb0-4ba8-a6e4-327a28179498")

Example:

```bash
node quick-test.js 1000 100 200
```

## Advanced Simulation

For more advanced testing with detailed options:

```bash
node simulate-signups.js [options]
```

Or use the npm script:

```bash
npm run simulate
```

### Options

- `-c, --count <number>`: Number of profiles to create (default: 500)
- `-b, --batch <number>`: Batch size for inserts (default: 50)
- `-d, --delay <number>`: Delay between batches in ms (default: 100)
- `--user-id <string>`: User ID to associate with profiles

Example:

```bash
node simulate-signups.js -c 1000 -b 100 -d 200 --user-id "your-user-id"
```

## Realistic Concurrent Simulation

For the most realistic simulation of users signing up simultaneously from different devices (like during a Zoom launch):

```bash
node concurrent-test.js [totalUsers] [concurrentUsers] [userId] [flags]
```

Or use the npm script:

```bash
npm run concurrent
```

### Parameters

- `totalUsers`: Total number of profiles to create (default: 500)
- `concurrentUsers`: Maximum number of concurrent users submitting forms (default: 50)
- `userId`: User ID to associate with all profiles (default: "2fdd8c60-fdb0-4ba8-a6e4-327a28179498")

### Flags

The concurrent test script includes additional features that can be enabled via flags:

#### Cleanup Flags
- `--auto-cleanup`: Automatically delete all created test profiles without confirmation
- `--skip-cleanup`: Skip the cleanup process entirely, leaving all test data in the database

#### Error Tracking Flags
- `--verbose`: Enable detailed error logging and show full error messages in the summary

Examples:

```bash
# Run with 1000 total users, 100 concurrent, and auto-cleanup
node concurrent-test.js 1000 100 --auto-cleanup

# Run with default settings but skip cleanup completely
node concurrent-test.js --skip-cleanup

# Run with verbose error reporting
node concurrent-test.js --verbose

# Combine flags as needed
node concurrent-test.js 500 50 --auto-cleanup --verbose
```

This approach simulates real users more accurately by:
- Creating separate Supabase client connections for each user
- Randomizing the time each user takes to fill out the form
- Maintaining a realistic number of concurrent form submissions
- Providing real-time statistics on throughput and performance

## Error Analysis

After the simulation completes, if any errors occurred, you'll see an error summary showing:

1. Categories of unique errors that occurred
2. Count and percentage of each error type
3. Full error messages (when using `--verbose`)

This helps identify patterns in database failures and pinpoint the specific issues that need to be addressed.

## Interpreting Results

After running the simulation, you'll see statistics including:

- Total execution time
- Number of successful inserts
- Number of failed inserts
- Average insertion rate (profiles per second)

This information helps you understand how your database performs under load. 