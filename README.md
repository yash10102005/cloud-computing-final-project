# 🌤 Weather Horizon - Cloud Hosted Weather App

![Weather App Screenshot](./screenshot.png)

A responsive weather dashboard hosted on Google Cloud Platform, featuring real-time weather data and dynamic visuals.

## ✨ Features
- Real-time weather by location
- Dynamic background & icons matching conditions
- Mobile-responsive design
- Hosted on Google Cloud Storage
- 4+ GCP services integrated

## ☁ GCP Services Used
| Service | Usage |
|---------|-------|
| *Cloud Storage (Buckets)* | Hosts static website files |
| *Cloud Functions* | Backend API proxy (optional) |
| *Firestore* | Saves user preferences (optional) | 
| *BigQuery* | Stores search history (optional) |

## 🚀 Deployment
```bash
# 1. Create bucket
gsutil mb gs://weather-app-$(whoami)

# 2. Enable web hosting
gsutil web set -m index.html gs://weather-app-$(whoami)

# 3. Upload files
gsutil -m cp -r *.html *.css *.js assets/ gs://weather-app-$(whoami)

# 4. Make public
gsutil iam ch allUsers:objectViewer gs://weather-app-$(whoami)