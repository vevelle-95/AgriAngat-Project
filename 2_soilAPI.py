import json
import requests
from typing import Dict, List, Optional
from ph_cities import CITY_CENTERS 

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
    
    def extract_all_depths(self, soil_data: Dict) -> Dict:
        """Extract values for all available depth layers"""
        if "properties" not in soil_data or "layers" not in soil_data["properties"]:
            return {"error": "Invalid soil data structure"}
        
        all_depths = {}
        layers = soil_data["properties"]["layers"]
        
        for layer in layers:
            prop_name = layer.get("name")
            if prop_name not in self.ag_properties:
                continue
            
            all_depths[prop_name] = {
                "name": self.ag_properties[prop_name]["name"],
                "unit": self.ag_properties[prop_name]["unit"],
                "depths": {}
            }
            
            conversion_factor = self.ag_properties[prop_name]["conversion"]
            
            for depth in layer.get("depths", []):
                depth_label = depth.get("label")
                if "values" in depth:
                    values = depth["values"]
                    
                    # Helper function to safely convert values
                    def safe_convert(value):
                        return value / conversion_factor if value is not None else None
                    
                    all_depths[prop_name]["depths"][depth_label] = {
                        "mean": safe_convert(values.get("mean")),
                        "median": safe_convert(values.get("Q0.5")),
                        "range": f"{depth['range']['top_depth']}-{depth['range']['bottom_depth']} {depth['range']['unit_depth']}"
                    }
        
        return all_depths
    
    def get_agricultural_summary(self, lat: float, lon: float, depth: str = "0-5cm") -> Dict:
        """Get a farmer-friendly summary of soil conditions"""
        soil_data = self.get_soil_data(lat, lon)
        
        if "error" in soil_data:
            return soil_data
        
        topsoil = self.extract_topsoil_values(soil_data, depth)
        
        if "error" in topsoil:
            return topsoil
        
        # Create agricultural interpretation
        summary = {
            "location": {"latitude": lat, "longitude": lon},
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
    """Example usage of SoilGridsExtractor"""
    
    # Initialize the extractor
    extractor = SoilGridsExtractor()
    
    # Show available cities
    citylist = input("Do you want to see all the Philippine Cities? (y/n) ").strip().lower()
    if citylist == "y":
        print("🏙️ Available Philippine Cities:")
        print("-" * 40)
        for city in sorted(CITY_CENTERS.keys()):
            print(f"  • {city.title()}")
        print()
    
    user_city = input("Enter a Philippine city: ").strip().lower()
    
    # Check if the city exists in our database
    if user_city not in CITY_CENTERS:
        print(f"❌ City '{user_city.title()}' not found in our database.")
        print("Please check the spelling or choose from the available cities above.")
        return
    
    # Get coordinates for the selected city
    lat, lon = CITY_CENTERS[user_city]
    
    print(f"🌱 Soil Analysis for {user_city.title()}")
    print(f"📍 Coordinates: {lat}, {lon}")
    print("=" * 50)
    
    # Get agricultural summary for topsoil
    summary = extractor.get_agricultural_summary(lat, lon)
    
    if "error" in summary:
        print(f"Error: {summary['error']}")
        return
    
    print(f"\nDepth Analyzed: {summary['depth_analyzed']}")
    print("\n📊 SOIL PROPERTIES:")
    print("-" * 30)
    
    for prop_key, prop_data in summary["soil_properties"].items():
        print(f"\n{prop_data['name']}:")
        
        # Check if we have valid data before displaying
        if prop_data['mean'] is not None:
            print(f"  Mean: {prop_data['mean']:.2f} {prop_data['unit']}")
        else:
            print(f"  Mean: No data available")
            
        if prop_data['median'] is not None:
            print(f"  Median: {prop_data['median']:.2f} {prop_data['unit']}")
        else:
            print(f"  Median: No data available")
            
        if prop_data['q05'] is not None and prop_data['q95'] is not None:
            print(f"  Range: {prop_data['q05']:.2f} - {prop_data['q95']:.2f} {prop_data['unit']}")
        else:
            print(f"  Range: No data available")
    
    print("\n🚜 AGRICULTURAL INTERPRETATION:")
    print("-" * 35)
    for aspect, advice in summary["agricultural_interpretation"].items():
        print(f"{aspect.replace('_', ' ').title()}: {advice}")
    
    print("\n" + "=" * 50)
    print("Analysis complete!")

if __name__ == "__main__":
    main()