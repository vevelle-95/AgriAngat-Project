#!/usr/bin/env python3
"""
Simple test script to verify Flask API is working
"""
import requests
import json

def test_weather_api():
    """Test the weather API endpoint"""
    urls_to_test = [
        "http://127.0.0.1:5000/health",
        "http://127.0.0.1:5000/api/weather/Manila",
        "http://localhost:5000/health",
        "http://localhost:5000/api/weather/Manila"
    ]
    
    for url in urls_to_test:
        try:
            print(f"\n🧪 Testing: {url}")
            response = requests.get(url, timeout=10)
            print(f"✅ Status: {response.status_code}")
            if response.status_code == 200:
                try:
                    data = response.json()
                    print(f"📄 Response: {json.dumps(data, indent=2)[:200]}...")
                except:
                    print(f"📄 Response: {response.text[:200]}...")
            else:
                print(f"❌ Error: {response.text}")
        except requests.exceptions.ConnectionError as e:
            print(f"❌ Connection Error: {e}")
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_weather_api()
