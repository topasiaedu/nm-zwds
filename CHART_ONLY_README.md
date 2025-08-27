# Chart-Only Endpoint Documentation

## Overview

The `/chart-only` endpoint is designed for backend server integration to generate ZWDS (Zi Wei Dou Shu) charts for screenshot purposes. This endpoint accepts profile data through URL parameters and renders only the chart component without any navigation, authentication, or other UI elements.

## URL Structure

```
/chart-only?year={year}&month={month}&day={day}&hour={hour}&gender={gender}&name={name}
```

## Parameters

| Parameter | Type | Required | Range | Description |
|-----------|------|----------|-------|-------------|
| `year` | number | Yes | 1900-2100 | Birth year |
| `month` | number | Yes | 1-12 | Birth month |
| `day` | number | Yes | 1-31 | Birth day |
| `hour` | number | Yes | 0-23 | Birth hour (24-hour format) |
| `gender` | string | Yes | "male" or "female" | Person's gender |
| `name` | string | No | Any | Person's name (optional) |

## Example URLs

### Basic Example
```
/chart-only?year=1990&month=1&day=1&hour=12&gender=male&name=John%20Doe
```

### Minimal Example (without name)
```
/chart-only?year=1990&month=1&day=1&hour=12&gender=male
```

### Female Example
```
/chart-only?year=1985&month=6&day=15&hour=14&gender=female&name=Jane%20Smith
```

## Backend Integration

### Node.js Example
```javascript
const puppeteer = require('puppeteer');

async function generateChartScreenshot(profileData) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport for consistent screenshots
  await page.setViewport({ width: 1200, height: 800 });
  
  // Navigate to the chart-only endpoint
  const url = `http://your-frontend-domain.com/chart-only?year=${profileData.year}&month=${profileData.month}&day=${profileData.day}&hour=${profileData.hour}&gender=${profileData.gender}&name=${encodeURIComponent(profileData.name)}`;
  
  await page.goto(url, { waitUntil: 'networkidle0' });
  
  // Wait for chart to load
  await page.waitForSelector('.chart-container', { timeout: 10000 });
  
  // Take screenshot
  const screenshot = await page.screenshot({ 
    fullPage: true,
    type: 'png'
  });
  
  await browser.close();
  return screenshot;
}

// Usage
const profileData = {
  year: 1990,
  month: 1,
  day: 1,
  hour: 12,
  gender: 'male',
  name: 'John Doe'
};

generateChartScreenshot(profileData)
  .then(screenshot => {
    // Save or process the screenshot
    require('fs').writeFileSync('chart.png', screenshot);
  });
```

### Python Example
```python
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

def generate_chart_screenshot(profile_data):
    # Setup Chrome options for headless mode
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1200,800")
    
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # Construct URL
        url = f"http://your-frontend-domain.com/chart-only?year={profile_data['year']}&month={profile_data['month']}&day={profile_data['day']}&hour={profile_data['hour']}&gender={profile_data['gender']}&name={profile_data['name']}"
        
        driver.get(url)
        
        # Wait for chart to load
        time.sleep(3)  # Adjust based on your app's load time
        
        # Take screenshot
        screenshot = driver.get_screenshot_as_png()
        
        return screenshot
        
    finally:
        driver.quit()

# Usage
profile_data = {
    'year': 1990,
    'month': 1,
    'day': 1,
    'hour': 12,
    'gender': 'male',
    'name': 'John Doe'
}

screenshot = generate_chart_screenshot(profile_data)
with open('chart.png', 'wb') as f:
    f.write(screenshot)
```

## Error Handling

The endpoint returns appropriate error messages for invalid parameters:

- **Missing Parameters**: "Missing required parameters: year, month, day, hour, gender"
- **Invalid Year**: "Year must be between 1900 and 2100"
- **Invalid Month**: "Month must be between 1 and 12"
- **Invalid Day**: "Day must be between 1 and 31"
- **Invalid Hour**: "Hour must be between 0 and 23"
- **Invalid Gender**: "Gender must be 'male' or 'female'"

## Features

- **No Authentication Required**: The endpoint is publicly accessible
- **Clean Rendering**: Only the chart component is rendered, no navigation or other UI elements
- **Responsive Design**: The chart adapts to different screen sizes
- **Error Handling**: Clear error messages for invalid parameters
- **Loading States**: Shows loading indicator while generating chart

## Testing

You can test the endpoint using the `/chart-test` route, which provides a form interface to generate test URLs and preview the chart generation.

## Security Considerations

- The endpoint is publicly accessible, so ensure your backend server is properly secured
- Consider implementing rate limiting if needed
- Validate all input parameters on your backend before making requests to this endpoint

## Performance

- The chart generation is client-side and typically loads within 1-3 seconds
- For high-volume screenshot generation, consider implementing caching strategies
- The endpoint is optimized for screenshot generation with `disableInteraction={true}` and `isPdfExport={true}` props 