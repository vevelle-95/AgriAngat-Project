import folium
import numpy as np
from typing import Dict
from sentinelhub import (
    SHConfig, MimeType, CRS, BBox, SentinelHubRequest, DataCollection, bbox_to_dimensions
)
from ph_cities import CITY_CENTERS


config = SHConfig()
config.instance_id = ""
config.sh_client_id = ""
config.sh_client_secret = ""

# Show available cities
citylist = input("Do you want to see all the Philippine Cities? (y/n) ").strip().lower()
if citylist == "y":
    print("🏙️ Available Philippine Cities:")
    print("-" * 40)
    for city in sorted(CITY_CENTERS):
        print(f"  • {city.title()}")
    print()

user_city = input("Enter a Philippine city: ").strip().lower()

# Check if the city exists in our database
if user_city not in CITY_CENTERS:
    print(f"❌ City '{user_city.title()}' not found in our database.")
    print("Please check the spelling or choose from the available cities above.")
    exit()  # use exit() in a script instead of return

# Get coordinates from the dictionary
lat, lon = CITY_CENTERS[user_city]

# Define a bounding box around the city (±0.01 degrees as an example)
bbox_coords = [lon - 0.01, lat - 0.01, lon + 0.01, lat + 0.01]

# Use BBox with CRS
bbox = BBox(bbox=bbox_coords, crs=CRS.WGS84)

print(f"Using coordinates for {user_city.title()}: {lat}, {lon}")
print(f"Bounding box set to: {bbox_coords} with CRS: {CRS.WGS84}")

# 🔹 Modified evalscript to get raw NDVI values (not colored)
evalscript_ndvi = """
//VERSION=3
function setup() {
  return {
    input: ["B04", "B08", "dataMask"],
    output: { 
      bands: 1,
      sampleType: "FLOAT32"
    }
  };
}

function evaluatePixel(sample) {
  // Calculate NDVI
  let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
  
  // Handle invalid pixels
  if (sample.dataMask == 0 || sample.B08 + sample.B04 == 0) {
    return [NaN];
  }
  
  return [ndvi];
}
"""

# 🔹 Colored evalscript for visualization (your original)
evalscript_colored = """
//VERSION=3
function setup() {
  return {
    input: ["B04", "B08", "dataMask"],
    output: { 
      bands: 4,
      sampleType: "AUTO"
    }
  };
}

Standard NDVI Color Scheme
Code 
Here's the updated NDVI coloring scheme that follows more typical remote sensing standards:

Key Changes:

Water bodies: Proper blue gradient from dark blue (deep water) to light blue (shallow water/wet areas)
Bare soil: Brown/tan colors instead of red, which is more realistic for soil
Vegetation gradient: Smooth transition from yellow-brown (sparse) → yellow-green → light green → dark green
Extended range: Added more granular thresholds up to 0.8+ for very dense vegetation
More natural colors: The progression now follows the typical "blue-brown-yellow-green" NDVI color ramp used in most remote sensing applications
This color scheme will make your NDVI maps more intuitive and comparable to standard vegetation health maps used in agriculture, forestry, and environmental monitoring.

function evaluatePixel(sample) {
  // Calculate NDVI
  let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
  
  // Handle invalid pixels
  if (sample.dataMask == 0 || sample.B08 + sample.B04 == 0) {
    return [0, 0, 0, 0]; // transparent
  }
  
  // Standard NDVI color mapping following typical remote sensing conventions
  let r, g, b;
  
  if (ndvi < -0.2) {
    // Deep water - dark blue
    r = 0.0; g = 0.0; b = 0.4;
  } else if (ndvi < -0.1) {
    // Shallow water - blue
    r = 0.0; g = 0.4; b = 0.8;
  } else if (ndvi < 0.0) {
    // Wet soil/sand - light blue
    r = 0.7; g = 0.8; b = 1.0;
  } else if (ndvi < 0.1) {
    // Bare soil/rock - brown/tan
    r = 0.8; g = 0.7; b = 0.5;
  } else if (ndvi < 0.2) {
    // Very sparse vegetation - light brown/beige
    r = 0.9; g = 0.8; b = 0.6;
  } else if (ndvi < 0.3) {
    // Sparse vegetation - yellow-brown
    r = 0.9; g = 0.9; b = 0.3;
  } else if (ndvi < 0.4) {
    // Moderate vegetation - yellow-green
    r = 0.6; g = 0.9; b = 0.2;
  } else if (ndvi < 0.5) {
    // Good vegetation - light green
    r = 0.3; g = 0.8; b = 0.2;
  } else if (ndvi < 0.6) {
    // Dense vegetation - medium green
    r = 0.1; g = 0.7; b = 0.1;
  } else if (ndvi < 0.8) {
    // Very dense vegetation - dark green
    r = 0.0; g = 0.6; b = 0.0;
  } else {
    // Extremely dense vegetation - very dark green
    r = 0.0; g = 0.4; b = 0.0;
  }
  
  return [r, g, b, 1.0]; // RGB + Alpha
}
"""

from datetime import datetime, timedelta

# Get recent imagery (last 30 days)
end_date = datetime.now()
start_date = end_date - timedelta(days=30)

# 🔹 Request for raw NDVI values
request_ndvi = SentinelHubRequest(
    evalscript=evalscript_ndvi,
    input_data=[
        SentinelHubRequest.input_data(
            data_collection=DataCollection.SENTINEL2_L2A,
            time_interval=(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')),
            mosaicking_order='leastCC'
        )
    ],
    responses=[SentinelHubRequest.output_response("default", MimeType.TIFF)],
    bbox=bbox,
    size=bbox_to_dimensions(bbox, resolution=10),
    config=config
)

# 🔹 Request for colored visualization
request_colored = SentinelHubRequest(
    evalscript=evalscript_colored,
    input_data=[
        SentinelHubRequest.input_data(
            data_collection=DataCollection.SENTINEL2_L2A,
            time_interval=(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')),
            mosaicking_order='leastCC'
        )
    ],
    responses=[SentinelHubRequest.output_response("default", MimeType.PNG)],
    bbox=bbox,
    size=bbox_to_dimensions(bbox, resolution=10),
    config=config
)

print("🛰️ Requesting NDVI data from Sentinel Hub...")

try:
    # Get raw NDVI values
    ndvi_data = request_ndvi.get_data()[0]
    ndvi_values = ndvi_data  # Extract first band
    
    # Get colored image for visualization
    ndvi_image = request_colored.get_data()[0]
    
    print("✅ Successfully retrieved NDVI data!")
    print(f"📊 Image dimensions: {ndvi_values.shape}")
    
    # 🔹 CALCULATE KEY NDVI STATISTICS
    print("\n" + "="*50)
    print("📈 MOST IMPORTANT NDVI VALUES (TEXT SUMMARY)")
    print("="*50)
    
    # Remove NaN values for statistics
    valid_ndvi = ndvi_values[~np.isnan(ndvi_values)]
    
    if len(valid_ndvi) > 0:
        # Basic statistics
        ndvi_mean = np.mean(valid_ndvi)
        ndvi_median = np.median(valid_ndvi)
        ndvi_std = np.std(valid_ndvi)
        ndvi_min = np.min(valid_ndvi)
        ndvi_max = np.max(valid_ndvi)
        
        print(f"🎯 OVERALL HEALTH SCORE: {ndvi_mean:.3f}")
        print(f"   Mean NDVI: {ndvi_mean:.3f}")
        print(f"   Median NDVI: {ndvi_median:.3f}")
        print(f"   Standard Deviation: {ndvi_std:.3f}")
        print(f"   Range: {ndvi_min:.3f} to {ndvi_max:.3f}")
        
        # Percentiles
        p25 = np.percentile(valid_ndvi, 25)
        p75 = np.percentile(valid_ndvi, 75)
        p90 = np.percentile(valid_ndvi, 90)
        p10 = np.percentile(valid_ndvi, 10)
        
        print(f"\n📊 KEY PERCENTILES:")
        print(f"   90th percentile (healthiest areas): {p90:.3f}")
        print(f"   75th percentile: {p75:.3f}")
        print(f"   25th percentile: {p25:.3f}")
        print(f"   10th percentile (least healthy): {p10:.3f}")
        
        # Vegetation coverage analysis
        water_bare = np.sum(valid_ndvi < 0.1)
        sparse_veg = np.sum((valid_ndvi >= 0.1) & (valid_ndvi < 0.3))
        moderate_veg = np.sum((valid_ndvi >= 0.3) & (valid_ndvi < 0.5))
        dense_veg = np.sum(valid_ndvi >= 0.5)
        total_pixels = len(valid_ndvi)
        
        print(f"\n🌱 VEGETATION COVERAGE BREAKDOWN:")
        print(f"   Water/Bare soil (< 0.1): {water_bare/total_pixels*100:.1f}% ({water_bare:,} pixels)")
        print(f"   Sparse vegetation (0.1-0.3): {sparse_veg/total_pixels*100:.1f}% ({sparse_veg:,} pixels)")
        print(f"   Moderate vegetation (0.3-0.5): {moderate_veg/total_pixels*100:.1f}% ({moderate_veg:,} pixels)")
        print(f"   Dense vegetation (≥ 0.5): {dense_veg/total_pixels*100:.1f}% ({dense_veg:,} pixels)")
        
        # Health interpretation
        print(f"\n🏥 VEGETATION HEALTH INTERPRETATION:")
        if ndvi_mean > 0.5:
            health_status = "EXCELLENT - Dense, healthy vegetation"
        elif ndvi_mean > 0.3:
            health_status = "GOOD - Moderate to dense vegetation"
        elif ndvi_mean > 0.1:
            health_status = "FAIR - Sparse vegetation, may need attention"
        else:
            health_status = "POOR - Very little vegetation, mostly bare soil/water"
        
        print(f"   Overall Status: {health_status}")
        
        # Hotspot analysis (areas of concern and excellence)
        if np.sum(valid_ndvi < 0.1) > total_pixels * 0.2:  # More than 20% low NDVI
            print(f"   ⚠️  CONCERN: {np.sum(valid_ndvi < 0.1)/total_pixels*100:.1f}% of area has very low vegetation")
        
        if np.sum(valid_ndvi > 0.6) > total_pixels * 0.1:  # More than 10% very high NDVI
            print(f"   ✨ EXCELLENCE: {np.sum(valid_ndvi > 0.6)/total_pixels*100:.1f}% of area has excellent vegetation")
            
        print(f"\n🔢 TECHNICAL DETAILS:")
        print(f"   Total valid pixels: {total_pixels:,}")
        print(f"   Invalid/masked pixels: {np.sum(np.isnan(ndvi_values)):,}")
        print(f"   Data coverage: {total_pixels/(ndvi_values.size)*100:.1f}%")
        
    else:
        print("❌ No valid NDVI data found in the selected area.")
    
    # Create visualization map
    map_center = [lat, lon]
    m = folium.Map(location=map_center, zoom_start=14)
    
    folium.raster_layers.ImageOverlay(
        image=ndvi_image,
        bounds=[[bbox_coords[1], bbox_coords[0]], [bbox_coords[3], bbox_coords[2]]],  # [[min_lat, min_lon], [max_lat, max_lon]]
        opacity=0.7,
        name="NDVI"
    ).add_to(m)

    folium.LayerControl().add_to(m)
    m.save(f"{user_city}.html")
    
    print(f"\n✅ NDVI map saved as {user_city}.html")
    print("="*50)
    
except Exception as e:
    print(f"❌ Error retrieving data: {e}")
    raise