import json
import requests
import math
import numpy as np
from typing import Dict, List, Optional, Tuple
from shapely.geometry import Polygon, Point
from shapely.ops import transform
import pyproj
from functools import partial

class SoilGridsExtractor:
    """Extract agriculturally relevant soil data from SoilGrids API"""
    
    def __init__(self):
        # Define agriculturally important soil properties
        self.ag_properties = {
            'phh2o': {'name': 'Soil pH (H2O)', 'unit': 'pH units', 'conversion': 10},
            'ocd': {'name': 'Organic Carbon Density', 'unit': 'hg/m³', 'conversion': 10},
            'nitrogen': {'name': 'Total Nitrogen', 'unit': 'g/kg', 'conversion': 100},
            'soc': {'name': 'Soil Organic Carbon', 'unit': 'g/kg', 'conversion': 10},
            'cec': {'name': 'Cation Exchange Capacity', 'unit': 'cmol(c)/kg', 'conversion': 10},
            'bdod': {'name': 'Bulk Density', 'unit': 'kg/dm³', 'conversion': 100},
            'clay': {'name': 'Clay Content', 'unit': '%', 'conversion': 10},
            'sand': {'name': 'Sand Content', 'unit': '%', 'conversion': 10},
            'silt': {'name': 'Silt Content', 'unit': '%', 'conversion': 10},
            'wv0010': {'name': 'Water Content at 10kPa', 'unit': '10⁻² cm³/cm³', 'conversion': 10},
            'wv0033': {'name': 'Water Content at 33kPa', 'unit': '10⁻² cm³/cm³', 'conversion': 10},
            'wv1500': {'name': 'Water Content at 1500kPa', 'unit': '10⁻² cm³/cm³', 'conversion': 10}
        }
        
        # Philippine cities data
        self.city_centers = {
            # metro manila cities
            "san juan": [14.6042, 121.0300],
            "quezon city": [14.6760, 121.0437],
            "manila": [14.5995, 120.9842],
            "makati": [14.5547, 121.0244],
            "pasig": [14.5764, 121.0851],
            "taguig": [14.5176, 121.0509],
            "mandaluyong": [14.5832, 121.0409],
            "marikina": [14.6507, 121.1029],
            "pasay": [14.5378, 120.9896],
            "parañaque": [14.4793, 121.0198],
            "las piñas": [14.4583, 120.9839],
            "muntinlupa": [14.3832, 121.0409],
            "caloocan": [14.6515, 120.9714],
            "malabon": [14.6575, 120.9559],
            "navotas": [14.6674, 120.9463],
            "valenzuela": [14.7006, 120.9822],
            
            # highly urbanized cities - luzon
            "baguio": [16.4023, 120.5960],
            "angeles": [15.1455, 120.5883],
            "olongapo": [14.8294, 120.2824],
            "san jose del monte": [14.8136, 121.0453],
            "antipolo": [14.5865, 121.1748],
            "lucena": [13.9373, 121.6174],
            "dagupan": [16.0433, 120.3340],
            "cabanatuan": [15.4859, 120.9661],
            "laoag": [18.1967, 120.5934],
            "santiago": [16.6877, 121.5468],
            "tuguegarao": [17.6140, 121.7270],
            "vigan": [17.5747, 120.3869],
            "san carlos": [15.9298, 120.3408],
            "tarlac city": [15.4817, 120.5979],
            "urdaneta": [15.9761, 120.5711],
            "san fernando (la union)": [16.6159, 120.3172],
            "san fernando (pampanga)": [15.0359, 120.6890],
            "malolos": [14.8458, 120.8112],
            "meycauayan": [14.7347, 120.9553],
            "san jose": [12.3528, 121.0688],
            "batangas city": [13.7565, 121.0583],
            "lipa": [13.9411, 121.1639],
            "tanauan": [14.0865, 121.1507],
            
            # visayas
            "cebu city": [10.3157, 123.8854],
            "lapu-lapu": [10.3103, 123.9494],
            "mandaue": [10.3237, 123.9227],
            "talisay": [10.2449, 123.8493],
            "toledo": [10.3773, 123.6434],
            "bogo": [11.0484, 124.0066],
            "carcar": [10.1093, 123.6401],
            "danao": [10.5229, 123.9552],
            "iloilo city": [10.7202, 122.5621],
            "roxas": [11.5854, 122.7510],
            "passi": [11.1084, 122.6397],
            "kabankalan": [9.9992, 122.8218],
            "bago": [10.5159, 122.8335],
            "himamaylan": [10.1021, 122.8697],
            "sagay": [10.8965, 123.4253],
            "san carlos (negros occidental)": [10.4817, 123.4184],
            "silay": [10.7969, 122.9705],
            "talisay (negros occidental)": [10.7459, 122.9820],
            "victorias": [10.9046, 123.0723],
            "cadiz": [10.9511, 123.2896],
            "escalante": [10.8394, 123.5039],
            "manapla": [10.9496, 123.1394],
            "bacolod": [10.6740, 122.9506],
            "dumaguete": [9.3068, 123.3054],
            "bayawan": [9.3644, 122.8028],
            "bais": [9.5936, 123.1211],
            "canlaon": [10.3734, 123.1323],
            "guihulngan": [10.1249, 123.2741],
            "tanjay": [9.5118, 123.1549],
            "tacloban": [11.2442, 125.0048],
            "ormoc": [11.0059, 124.6074],
            "maasin": [10.1301, 124.8347],
            "baybay": [10.6785, 124.8006],
            "tagbilaran": [9.6496, 123.8570],
            
            # mindanao
            "davao city": [7.1907, 125.4553],
            "tagum": [7.4479, 125.8072],
            "panabo": [7.3059, 125.6836],
            "island garden city of samal": [7.0731, 125.7088],
            "digos": [6.7498, 125.3573],
            "mati": [6.9552, 126.2178],
            "general santos": [6.1164, 125.1716],
            "koronadal": [6.5000, 124.8500],
            "tacurong": [6.6907, 124.6774],
            "kidapawan": [7.0109, 125.0896],
            "cotabato city": [7.2232, 124.2467],
            "zamboanga city": [6.9214, 122.0790],
            "pagadian": [7.8269, 123.4348],
            "dipolog": [8.5881, 123.3427],
            "dapitan": [8.6581, 123.4197],
            "ozamiz": [8.1501, 123.8424],
            "tangub": [8.0648, 123.7474],
            "oroquieta": [8.4859, 123.8052],
            "cagayan de oro": [8.4542, 124.6319],
            "gingoog": [8.8258, 125.1015],
            "el salvador": [8.5336, 124.5119],
            "malaybalay": [8.1532, 125.0761],
            "valencia": [7.9064, 125.0939],
            "butuan": [8.9470, 125.5439],
            "cabadbaran": [9.1232, 125.5347],
            "bayugan": [8.7514, 125.7347],
            "bislig": [8.2061, 126.3217],
            "tandag": [9.0736, 126.1947],
            "surigao": [9.7737, 125.4900],
            "iligan": [8.2280, 124.2452],
            "marawi": [8.0025, 124.2864],
            
            # palawan
            "puerto princesa": [9.7392, 118.7353],
            
            # bicol region
            "legazpi": [13.1391, 123.7436],
            "tabaco": [13.3594, 123.7335],
            "ligao": [13.2298, 123.5298],
            "naga": [13.6192, 123.1816],
            "iriga": [13.4217, 123.4103],
            "masbate city": [12.3698, 123.6178],
            "sorsogon city": [12.9706, 124.0073],
            
            # northern luzon
            "bontoc": [17.0896, 121.0355],
            "tabuk": [17.4189, 121.4443],
            "lamitan": [6.6465, 122.1413],
            
            # island cities
            "jolo": [6.0549, 121.0031],
            "bongao": [5.0314, 119.7730],
            "isabela city": [6.7014, 121.9744]
        }
    
    def calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two coordinates using Haversine formula (in km)"""
        R = 6371  # Earth's radius in km
        
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        delta_lat = math.radians(lat2 - lat1)
        delta_lon = math.radians(lon2 - lon1)
        
        a = (math.sin(delta_lat/2) * math.sin(delta_lat/2) + 
             math.cos(lat1_rad) * math.cos(lat2_rad) * 
             math.sin(delta_lon/2) * math.sin(delta_lon/2))
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        
        return R * c
    
    def find_nearest_city(self, lat: float, lon: float) -> Dict:
        """Find the nearest Philippine city to given coordinates"""
        nearest_city = None
        min_distance = float('inf')
        
        for city_name, (city_lat, city_lon) in self.city_centers.items():
            distance = self.calculate_distance(lat, lon, city_lat, city_lon)
            if distance < min_distance:
                min_distance = distance
                nearest_city = city_name
        
        return {
            "city": nearest_city.title() if nearest_city else "Unknown",
            "distance_km": round(min_distance, 2) if nearest_city else None,
            "coordinates": self.city_centers.get(nearest_city, [None, None]) if nearest_city else [None, None]
        }
    
    def generate_grid_points(self, polygon_coords: List[Tuple[float, float]], 
                           spacing_km: float = 0.5) -> List[Tuple[float, float]]:
        """Generate grid points within a polygon for sampling"""
        if len(polygon_coords) < 3:
            raise ValueError("Polygon must have at least 3 points")
        
        # Create polygon
        polygon = Polygon([(lon, lat) for lat, lon in polygon_coords])
        
        # Get bounding box
        min_lon, min_lat, max_lon, max_lat = polygon.bounds
        
        # Convert spacing from km to degrees (approximate)
        lat_spacing = spacing_km / 111.0  # 1 degree ≈ 111 km
        lon_spacing = spacing_km / (111.0 * math.cos(math.radians((min_lat + max_lat) / 2)))
        
        # Generate grid points
        grid_points = []
        current_lat = min_lat
        
        while current_lat <= max_lat:
            current_lon = min_lon
            while current_lon <= max_lon:
                point = Point(current_lon, current_lat)
                if polygon.contains(point):
                    grid_points.append((current_lat, current_lon))
                current_lon += lon_spacing
            current_lat += lat_spacing
        
        return grid_points
    
    def get_soil_data(self, lat: float, lon: float) -> Dict:
        """Fetch soil data from SoilGrids API"""
        url = f"https://rest.isric.org/soilgrids/v2.0/properties/query?lon={lon}&lat={lat}"
        
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {"error": f"API request failed: {str(e)}"}
    
    def extract_topsoil_values(self, soil_data: Dict, depth_label: str = "0-5cm") -> Dict:
        """Extract values for a specific depth layer (default: topsoil 0-5cm)"""
        extracted = {}
        
        if "properties" not in soil_data or "layers" not in soil_data["properties"]:
            return {"error": "Invalid soil data structure"}
        
        layers = soil_data["properties"]["layers"]
        
        for layer in layers:
            prop_name = layer.get("name")
            if prop_name not in self.ag_properties:
                continue
            
            # Find the specified depth
            depths = layer.get("depths", [])
            target_depth = None
            
            for depth in depths:
                if depth.get("label") == depth_label:
                    target_depth = depth
                    break
            
            if target_depth and "values" in target_depth:
                values = target_depth["values"]
                conversion_factor = self.ag_properties[prop_name]["conversion"]
                
                # Helper function to safely convert values
                def safe_convert(value):
                    return value / conversion_factor if value is not None else None
                
                # Convert values from mapped units to target units (handle None values)
                extracted[prop_name] = {
                    "name": self.ag_properties[prop_name]["name"],
                    "unit": self.ag_properties[prop_name]["unit"],
                    "mean": safe_convert(values.get("mean")),
                    "median": safe_convert(values.get("Q0.5")),
                    "q05": safe_convert(values.get("Q0.05")),
                    "q95": safe_convert(values.get("Q0.95")),
                    "uncertainty": safe_convert(values.get("uncertainty"))
                }
        
        return extracted
    
    def analyze_polygon_soil(self, polygon_coords: List[Tuple[float, float]], 
                           spacing_km: float = 0.5, depth: str = "0-5cm") -> Dict:
        """Analyze soil data for a polygon area using grid sampling"""
        print(f"🔍 Generating sampling grid with {spacing_km}km spacing...")
        
        try:
            grid_points = self.generate_grid_points(polygon_coords, spacing_km)
        except Exception as e:
            return {"error": f"Grid generation failed: {str(e)}"}
        
        if not grid_points:
            return {"error": "No sampling points generated within polygon"}
        
        print(f"📍 Generated {len(grid_points)} sampling points")
        print("🌱 Collecting soil data from each point...")
        
        # Collect data from all points
        all_data = []
        failed_points = 0
        
        for i, (lat, lon) in enumerate(grid_points):
            print(f"   Sampling point {i+1}/{len(grid_points)} ({lat:.4f}, {lon:.4f})")
            
            soil_data = self.get_soil_data(lat, lon)
            if "error" not in soil_data:
                extracted = self.extract_topsoil_values(soil_data, depth)
                if "error" not in extracted:
                    extracted["coordinates"] = (lat, lon)
                    all_data.append(extracted)
                else:
                    failed_points += 1
            else:
                failed_points += 1
        
        if not all_data:
            return {"error": "No valid soil data collected from any sampling points"}
        
        print(f"✅ Successfully collected data from {len(all_data)} points ({failed_points} failed)")
        
        # Aggregate the data
        return self._aggregate_polygon_data(all_data, polygon_coords, spacing_km, depth)
    
    def _aggregate_polygon_data(self, all_data: List[Dict], polygon_coords: List[Tuple[float, float]], 
                               spacing_km: float, depth: str) -> Dict:
        """Aggregate soil data from multiple sampling points"""
        
        # Initialize aggregated results
        aggregated = {
            "polygon_info": {
                "vertices": polygon_coords,
                "sampling_points": len(all_data),
                "grid_spacing_km": spacing_km,
                "depth_analyzed": depth
            },
            "spatial_statistics": {},
            "variability_analysis": {},
            "agricultural_zones": {}
        }
        
        # Get all property names from the first data point
        if not all_data:
            return {"error": "No data to aggregate"}
        
        property_names = [prop for prop in all_data[0].keys() if prop != "coordinates"]
        
        # Calculate statistics for each property
        for prop_name in property_names:
            values = []
            valid_points = []
            
            for data_point in all_data:
                if prop_name in data_point and data_point[prop_name]["mean"] is not None:
                    values.append(data_point[prop_name]["mean"])
                    valid_points.append(data_point)
            
            if values:
                values_array = np.array(values)
                
                aggregated["spatial_statistics"][prop_name] = {
                    "name": all_data[0][prop_name]["name"],
                    "unit": all_data[0][prop_name]["unit"],
                    "area_mean": float(np.mean(values_array)),
                    "area_median": float(np.median(values_array)),
                    "area_std": float(np.std(values_array)),
                    "area_min": float(np.min(values_array)),
                    "area_max": float(np.max(values_array)),
                    "valid_samples": len(values)
                }
                
                # Calculate coefficient of variation for variability analysis
                cv = (np.std(values_array) / np.mean(values_array)) * 100 if np.mean(values_array) != 0 else 0
                
                variability_level = "Low"
                if cv > 15:
                    variability_level = "Moderate"
                if cv > 30:
                    variability_level = "High"
                
                aggregated["variability_analysis"][prop_name] = {
                    "coefficient_of_variation_percent": round(cv, 2),
                    "variability_level": variability_level,
                    "interpretation": self._interpret_variability(prop_name, cv)
                }
        
        # Agricultural zone recommendations
        aggregated["agricultural_zones"] = self._identify_management_zones(all_data)
        
        # Overall agricultural interpretation
        aggregated["agricultural_interpretation"] = self._interpret_polygon_agriculture(
            aggregated["spatial_statistics"]
        )
        
        return aggregated
    
    def _interpret_variability(self, prop_name: str, cv: float) -> str:
        """Interpret spatial variability for agricultural management"""
        interpretations = {
            "phh2o": {
                "low": "Uniform pH - single lime application strategy suitable",
                "moderate": "Some pH variation - consider zone-specific lime rates",
                "high": "High pH variability - requires variable-rate lime application"
            },
            "nitrogen": {
                "low": "Uniform nitrogen - consistent fertilizer application",
                "moderate": "Moderate N variation - consider split applications",
                "high": "High N variability - precision fertilizer management needed"
            },
            "soc": {
                "low": "Uniform organic matter - consistent soil health",
                "moderate": "Some organic matter variation - targeted organic inputs",
                "high": "Variable organic matter - zone-specific management needed"
            }
        }
        
        level = "low" if cv <= 15 else "moderate" if cv <= 30 else "high"
        return interpretations.get(prop_name, {}).get(level, f"Variability level: {level}")
    
    def _identify_management_zones(self, all_data: List[Dict]) -> Dict:
        """Identify potential management zones based on soil properties"""
        zones = {
            "high_productivity": [],
            "moderate_productivity": [],
            "needs_improvement": []
        }
        
        for data_point in all_data:
            lat, lon = data_point["coordinates"]
            score = 0
            factors = 0
            
            # pH scoring
            if "phh2o" in data_point and data_point["phh2o"]["mean"] is not None:
                ph = data_point["phh2o"]["mean"]
                if 6.0 <= ph <= 7.0:
                    score += 2
                elif 5.5 <= ph <= 7.5:
                    score += 1
                factors += 2
            
            # Organic matter scoring
            if "soc" in data_point and data_point["soc"]["mean"] is not None:
                soc = data_point["soc"]["mean"]
                if soc > 20:
                    score += 2
                elif soc > 10:
                    score += 1
                factors += 2
            
            # Nitrogen scoring
            if "nitrogen" in data_point and data_point["nitrogen"]["mean"] is not None:
                n = data_point["nitrogen"]["mean"]
                if n > 2.0:
                    score += 2
                elif n > 1.0:
                    score += 1
                factors += 2
            
            if factors > 0:
                avg_score = score / factors
                point_info = {"lat": lat, "lon": lon, "score": round(avg_score, 2)}
                
                if avg_score >= 1.5:
                    zones["high_productivity"].append(point_info)
                elif avg_score >= 0.75:
                    zones["moderate_productivity"].append(point_info)
                else:
                    zones["needs_improvement"].append(point_info)
        
        return zones
    
    def _interpret_polygon_agriculture(self, spatial_stats: Dict) -> Dict:
        """Provide agricultural interpretation for polygon area"""
        interpretation = {}
        
        # Overall pH assessment
        if "phh2o" in spatial_stats:
            ph_mean = spatial_stats["phh2o"]["area_mean"]
            ph_std = spatial_stats["phh2o"]["area_std"]
            
            if ph_mean < 5.5:
                interpretation["pH"] = f"Area is acidic (avg: {ph_mean:.1f}) - lime application recommended"
            elif ph_mean > 7.5:
                interpretation["pH"] = f"Area is alkaline (avg: {ph_mean:.1f}) - may affect nutrient availability"
            else:
                interpretation["pH"] = f"Good pH range (avg: {ph_mean:.1f}) for most crops"
            
            if ph_std > 0.5:
                interpretation["pH"] += f" - High variation (±{ph_std:.1f}) suggests zone management"
        
        # Organic matter assessment
        if "soc" in spatial_stats:
            soc_mean = spatial_stats["soc"]["area_mean"]
            if soc_mean < 15:
                interpretation["organic_matter"] = f"Low organic matter (avg: {soc_mean:.1f} g/kg) - organic inputs needed"
            else:
                interpretation["organic_matter"] = f"Good organic matter levels (avg: {soc_mean:.1f} g/kg)"
        
        return interpretation
    
    def get_agricultural_summary(self, lat: float, lon: float, depth: str = "0-5cm") -> Dict:
        """Get a farmer-friendly summary of soil conditions with city recognition"""
        # Find nearest city
        city_info = self.find_nearest_city(lat, lon)
        
        soil_data = self.get_soil_data(lat, lon)
        
        if "error" in soil_data:
            return {**soil_data, "location": city_info}
        
        topsoil = self.extract_topsoil_values(soil_data, depth)
        
        if "error" in topsoil:
            return {**topsoil, "location": city_info}
        
        # Create agricultural interpretation
        summary = {
            "location": {
                "coordinates": {"latitude": lat, "longitude": lon},
                "nearest_city": city_info,
                "coverage_area": "~6.25 hectares (250m x 250m pixel)"
            },
            "depth_analyzed": depth,
            "soil_properties": topsoil,
            "agricultural_interpretation": self._interpret_for_agriculture(topsoil)
        }
        
        return summary
    
    def _interpret_for_agriculture(self, soil_props: Dict) -> Dict:
        """Provide agricultural interpretation of soil data"""
        interpretation = {}
        
        # pH interpretation
        if "phh2o" in soil_props and soil_props["phh2o"]["mean"] is not None:
            ph = soil_props["phh2o"]["mean"]
            if ph < 5.5:
                interpretation["pH"] = "Acidic - may need liming"
            elif ph > 7.5:
                interpretation["pH"] = "Alkaline - may affect nutrient availability"
            else:
                interpretation["pH"] = "Good pH range for most crops"
        
        # Organic matter interpretation
        if "soc" in soil_props and soil_props["soc"]["mean"] is not None:
            soc = soil_props["soc"]["mean"]
            if soc < 10:
                interpretation["organic_matter"] = "Low - consider adding compost/organic matter"
            elif soc > 30:
                interpretation["organic_matter"] = "High - excellent soil health"
            else:
                interpretation["organic_matter"] = "Moderate organic matter levels"
        
        # Nitrogen interpretation
        if "nitrogen" in soil_props and soil_props["nitrogen"]["mean"] is not None:
            n = soil_props["nitrogen"]["mean"]
            if n < 1.0:
                interpretation["nitrogen"] = "Low - may need nitrogen fertilization"
            elif n > 3.0:
                interpretation["nitrogen"] = "High nitrogen content"
            else:
                interpretation["nitrogen"] = "Adequate nitrogen levels"
        
        # Texture interpretation
        texture_props = ["clay", "sand", "silt"]
        if all(prop in soil_props and soil_props[prop]["mean"] is not None for prop in texture_props):
            clay = soil_props["clay"]["mean"]
            sand = soil_props["sand"]["mean"]
            silt = soil_props["silt"]["mean"]
            
            if clay > 40:
                interpretation["texture"] = "Clay soil - good water retention, may have drainage issues"
            elif sand > 60:
                interpretation["texture"] = "Sandy soil - good drainage, may need frequent irrigation"
            else:
                interpretation["texture"] = "Loamy soil - ideal for most crops"
        
        return interpretation

# Example usage and testing
def main():
    """Example usage of SoilGridsExtractor with both point and polygon analysis"""
    
    # Initialize the extractor
    extractor = SoilGridsExtractor()
    
    print("🌾 ADVANCED SOIL ANALYSIS SYSTEM")
    print("=" * 50)
    
    # Example 1: Single point analysis with city recognition
    print("\n1️⃣ SINGLE POINT ANALYSIS")
    print("-" * 30)
    lat, lon = 14.69, 121.3
    
    summary = extractor.get_agricultural_summary(lat, lon)
    
    if "error" in summary:
        print(f"Error: {summary['error']}")
    else:
        city_info = summary["location"]["nearest_city"]
        print(f"📍 Location: {city_info['city']}")
        print(f"📏 Distance from city center: {city_info['distance_km']} km")
        print(f"📐 Coordinates: {lat}, {lon}")
        print(f"📊 Coverage: {summary['location']['coverage_area']}")
        
        print(f"\n📋 Depth Analyzed: {summary['depth_analyzed']}")
        print("\n🧪 SOIL PROPERTIES:")
        for prop_key, prop_data in summary["soil_properties"].items():
            if prop_data['mean'] is not None:
                print(f"  • {prop_data['name']}: {prop_data['mean']:.2f} {prop_data['unit']}")
        
        print("\n💡 AGRICULTURAL ADVICE:")
        for aspect, advice in summary["agricultural_interpretation"].items():
            print(f"  • {aspect.replace('_', ' ').title()}: {advice}")
    
    # Example 2: Polygon analysis (small farm area)
    print("\n\n2️⃣ POLYGON AREA ANALYSIS")
    print("-" * 30)
    
    # Define a small polygon (example: rectangular farm area)
    farm_polygon = [
        (14.68, 121.29),  # Southwest corner
        (14.68, 121.31),  # Southeast corner
    ]